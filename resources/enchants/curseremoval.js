const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curseremoval',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    user.curse = false
    user.save()
    return int.reply(`Debuff 'Curse' removed from ${user.tag}.`)
    // Toby! Fix                                    ^^^^^^^^
  },
}