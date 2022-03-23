const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('@discordjs/builders')

// Toby add func.logs for all the enchants

module.exports = {
  name: 'antidote',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    userEffects.poison = Number(0)
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Poison' removed from <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  }
}