const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'curse',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUser.curse = true
    tUser.curse_time = Date.now()
    tUser.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Curse' added to <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}