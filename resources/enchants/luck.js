const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'luck',
  async execute(int, userEffects, user) {
    let rand = Math.round((Math.random()) + 2)
    user.luck += Number(rand)
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`<@${user.user.id}> gained ${rand} luck!`)

    return int.channel.send({ embeds: [embededd] })
  },
}