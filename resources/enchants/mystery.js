const func = require('../functions')
const app = require('../../app')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'mystery',
  async execute(int, userEffects, user) {
    const rand = Math.round(Math.random() * 4)
    switch (rand) {
      case 0:
        await require('./flame.js').execute(int, userEffects, user)
        break;
      case 1:
        await require('./poison.js').execute(int, userEffects, user)
        break;
      case 2:
        await require('./fishing.js').execute(int, userEffects, user)
        break;
      case 3:
        await require('./luck.js').execute(int, userEffects, user)
        break;
      case 4:
        await require('./curse.js').execute(int, userEffects, user)
        break;
    }
  },
}