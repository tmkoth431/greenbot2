const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'poison',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUserEffects.poison = Number(6)
    tUserEffects.save()
    return int.reply(`Debuff 'Poison' added to ${int.user.username}.`)
  },
}