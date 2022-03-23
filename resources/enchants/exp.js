const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'exp',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.exp += Number(10)
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`<@${int.user.id}> gained 10XP!`) // if you make the amout random, put the variable in here

    return int.channel.send({ embeds: [embededd] })
  },
}