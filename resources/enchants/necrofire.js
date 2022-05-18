const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'flame',
  async execute(int, userEffects, user) {
    userEffects.necrofire = Boolean(true);
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Fire' added to <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}