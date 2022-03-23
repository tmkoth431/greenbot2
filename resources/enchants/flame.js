const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  async execute(int, userEffects, user) {
    userEffects.burn = Number(3)
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Fire' added to <@${int.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}