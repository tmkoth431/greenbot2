const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'exp',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.exp += Number(10)
    user.save()
    return int.channel.send(`+10 XP added to ${int.user.username}.`)
  },
}