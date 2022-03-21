const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'flame',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUserEffects.burn = Number(3)
    tUserEffects.save()
    return int.channel.send(`Debuff 'On Fire' added to <@${tUser.user_id}>.`)
  },
}