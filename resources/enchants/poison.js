const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'poison',
  async execute(int, userEffects, user) {
    userEffects.poison = Number(6)
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Poison' added to <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}