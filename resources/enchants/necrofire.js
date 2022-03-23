const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  async execute(int, userEffects, user) {
    userEffects.necrofire = Boolean(true)
    userEffects.save()
    return int.channel.send(`<@${user.user_id}>, you have been set on fire`)
    // Toby! Make the reply always be the same as flame.js
  },
}