const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'exp',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.exp += Number(10)
    user.save()
    return int.reply(`+10 XP added to ${user.tag}.`)
    // Toby! Fix                        ^^^^^^^^
  },
}