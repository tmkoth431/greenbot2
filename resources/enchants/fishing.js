const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'fishing',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.fish_exp += Number(5)
    user.save()
    const embededd = new MessageEmbed()
      .setTitle('Effects')
      .setColor('#25c059')
      .setDescription(`<@${int.user.id}> gained 10 Fishing XP!`) // if you make the amount random, put the variable here!

    return int.channel.send({ embeds: [embededd] })
  },
}