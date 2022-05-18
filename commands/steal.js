const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Steals money from a target')
    .addUserOption(options =>
      options.setName('user')
        .setDescription('The targeted user')
        .setRequired(false)),
  cooldown: '120',
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const embededd = new MessageEmbed()
      .setTitle(`Steal`)
      .setColor('#25c059')

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
        embededd.setDescription(`<@${int.user.id}> stole from an innocent civilian and earned \$${money}!`)
        return int.reply({ embeds: [embededd] })
      } else {
        user.crime_exp -= 1
        user.balance -= (money * 1.5)
        user.save()
        func.log(`tried mugging an innocent civilian and lost ${money * 1.5}`, int, c)
        embededd.setDescription(`<@${int.user.id}> tried to steal from an innocent civilian and lost \$${money * 1.5}!`)
        return int.reply({ embeds: [embededd] })
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
        func.log(`stole \$${money} from ${target}`, int, c)
        embededd.setDescription(`<@${int.user.id}> stole \$${money} from ${target}!`)
        return int.reply({ embeds: [embededd] })
      } else {
        const money = Math.round(user.balance * .05)
        user.crime_exp += 1
        user.balance += money
        u.crime_exp -= 1
        u.balance -= money
        user.save()
        u.save()
        func.log(`tried to mug ${target} and lost ${money}`, int, c)
        embededd.setDescription(`<@${int.user.id}> tried to steal from ${target} and lost \$${money}!`)
        return int.reply({ embeds: [embededd] })
      }

    }
  },
}