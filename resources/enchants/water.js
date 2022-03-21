const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'water',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    userEffects.burn = Number(0)
    userEffects.save()
    return int.channel.send(`Debuff 'On Fire' removed from ${int.user.username}.`)
  },
}