const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'exp',
  async execute(int, userEffects, user) {
    let rand = Math.round((Math.random() * 10) + 5)
    user.exp += Number(rand)
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`<@${int.user.id}> gained ${rand}XP!`)

    return int.channel.send({ embeds: [embededd] })
  },
}