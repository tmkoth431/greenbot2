const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('steals money from target')
    .addUserOption(options =>
      options.setName('user')
        .setDescription('target user')
        .setRequired(false)),
  cooldown: '120',
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const target = int.options.getUser('user') ?? int.user;
    const user = app.currency.get(target.id)
    if (target == int.user) {
      const suc = Math.round(Math.random() * 100)
      const money = Math.round(user.balance / 10)
      if (suc >= 50) {
        user.crime_exp += 1
        user.balance += money
        user.exp += Number(2)
        user.save()
        func.log(`mugged an innocent civilian for ${money}`, int, c)
        return int.reply(`${int.user.tag} stole from an innocent civilian for ${money}💰`)
      } else {
        user.crime_exp -= 1
        user.balance -= (money * 1.5)
        user.save()
        func.log(`tried mugged an innocent civilian and lost ${money * 1.5}`, int, c)
        return int.reply(`${int.user.tag} tried to steal from an innocent civilian and lost ${money * 1.5}💰`)
      }

    } else {
      const u = app.currency.get(int.user.id)
      const suc = Math.round(Math.random() * 100)
      if (suc >= 50) {
        const money = Math.round(user.balance * .15)
        user.crime_exp -= 1
        user.balance -= money
        u.crime_exp += 1
        u.balance += money
        u.exp += Number(3)
        user.save()
        u.save()
        func.log(`stole ${target} for ${money}`, int, c)
        return int.reply(`${int.user.tag} stole ${money}💰 from ${target}`)
      } else {
        const money = Math.round(user.balance * .05)
        user.crime_exp += 1
        user.balance += money
        u.crime_exp -= 1
        u.balance -= money
        user.save()
        u.save()
        func.log(`tried to mug ${target} and lost ${money}`, int, c)
        return int.reply(`${int.user.tag} tried to steal from ${target} and lost ${money}💰`)
      }

    }
  },
}