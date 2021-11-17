const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createmoney')
    .setDescription('creates money')
    .addNumberOption(option =>
      option.setName('input')
        .setDescription('money to generate')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const user = app.currency.get(int.user.id);
    const input = int.options.getNumber('input')
    user.balance += Number(input)
    user.save()
    func.log(`created $${input}`, int, c)
    return int.reply(`created $${input}`)
  },
}