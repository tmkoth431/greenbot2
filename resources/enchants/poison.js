const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'poison',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUserEffects.poison = Number(6)
    tUserEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Poison' added to <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}