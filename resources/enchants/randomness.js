const func = require('../functions')
const app = require('../../app')

// Toby make these all take from the different .js files, instead of this

module.exports = {
  name: 'randomness',
  async execute(int, userEffects, tUserEffects, user, tUser) {
    const rand = Math.round(Math.random() * 8)
    switch (rand) {
      case 0:
        userEffects.burn = Number(2)
        userEffects.save()
        int.reply('you have been set on fire')
        break
      case 1:
        userEffects.poison = Number(5)
        userEffects.save()
        int.reply('you have been poisoned')
        break
      case 2:
        user.fish_exp += Math.round(user.fish_exp / 10)
        user.save()
        int.reply('you get better at fishing')
        break
      case 3:
        user.luck += Number(2)
        user.save()
        int.reply('you get luckier')
        break
      case 4:
        tUserEffects.burn = Number(2)
        tUserEffects.save()
        int.reply(`<@${tUser.user_id}>, you have been set on fire`)
        break
      case 5:
        tUserEffects.poison = Number(5)
        tUserEffects.save()
        int.reply(`<@${tUser.user_id}>, you have been poisoned`)
        break
      case 6:
        tUser.fish_exp += Math.round(tUser.fish_exp / 15)
        tUser.save()
        int.reply(`<@${tUser.user_id}>, you got better at fishing`)
        break
      case 7:
        tUser.luck += Number(2)
        tUser.save()
        int.reply(`<@${tUser.user_id}>, you got luckier`)
        break
      case 8:
        tUser.curse = true
        tUser.curse_time = Date.now()
        tUser.save()
        int.reply(`<@${tUser.user_id}>, you have been cursed`)
        break
    }
  },
}