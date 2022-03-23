const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'water',
  async execute(int, userEffects, user) {
    userEffects.burn = Number(0)
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Fire' removed from <@${user.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}