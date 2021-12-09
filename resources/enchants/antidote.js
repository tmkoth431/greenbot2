const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'antidote',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    userEffects.poison = Number(0)
    userEffects.save()
    return int.reply(`Debuff 'Poison' removed from ${int.user.username}.`)
  }
}