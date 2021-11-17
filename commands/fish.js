const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('go fishing'),
  cooldown: '45',
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const user = app.currency.get(int.user.id);
    if (user.combat) return message.channel.send('you cannot do that while in combat')
    const fishexp = user.fish_exp || 0;
    const randmult = Math.sqrt(fishexp) * 2
    const randmult2 = Number(user.luck) / Math.round((Math.random() + 1) * 2)
    const rand = Math.round(Math.random() * randmult + 1 + randmult2)
    const money = rand / 2
    const biggest = user.biggest_catch || 0;
    const newrec = Math.max(rand, biggest)

    user.balance += Number(rand);
    user.fish_exp += Number(1);
    user.biggest_catch = Number(newrec)
    user.exp += Number(1)
    user.save();

    func.log(`caught a ${rand}in fish`, int, c)
    return int.reply(`${int.user.tag} caught a ${rand}in :fish:`)
  },
};