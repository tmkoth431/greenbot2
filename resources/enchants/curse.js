const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curse',
  async execute(int, userEffects, user) {
    user.curse = true
    user.curse_time = Date.now()
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Curse' added to <@${user.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}