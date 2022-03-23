const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curseremoval',
  async execute(int, userEffects, user) {
    user.curse = false
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Curse' removed from <@${user.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}