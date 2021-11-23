const func = require('../functions')
const app = require('../../app')

module.exports = {
  name: 'curse',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    tUser.curse = true
    tUser.curse_time = Date.now()
    tUser.save()
    return int.reply(`Debuff 'Curse' added to ${user.tag}.`);
    // Toby! Fix                                ^^^^^^^^
  },
}