const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'fishing',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.fish_exp += Number(5)
    user.save()
    return int.reply('you get better at fishing')
  },
}