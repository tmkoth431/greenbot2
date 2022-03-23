const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'flame',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUserEffects.necrofire = Boolean(true)
    tUserEffects.save()
    return int.channel.send(`<@${tUser.user_id}>, you have been set on fire`)
    // Toby! Make the reply always be the same as flame.js
  },
}