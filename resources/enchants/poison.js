const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'poison',
  async execute(int, userEffects, user) {
    userEffects.poison = Number(6)
    userEffects.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`Debuff 'Poison' added to <@${user.user.id}>!`)

    return int.channel.send({ embeds: [embededd] })
  },
}