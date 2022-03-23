const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'fishing',
  async execute(int, userEffects, user) {
    let rand = Math.round((Math.random() * 3) + 2)
    user.fish_exp += Number(rand)
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`<@${user.user.id}> gained ${rand} Fishing XP!`) // if you make the amount random, put the variable here!

    return int.channel.send({ embeds: [embededd] })
  },
}