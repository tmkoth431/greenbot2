const { SlashCommandBuilder } = require('@discordjs/builders');
const { Formatters } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level up')
    .addStringOption(options =>
      options.setName('stat')
        .setDescription('stat to level up')
        .setRequired(true)
        .addChoice('health', 'h')
        .addChoice('luck', 'l')
        .addChoice('strength', 's')
        .addChoice('dexterity', 'd'))
    .addIntegerOption(options =>
      options.setName('amount')
        .setDescription('amount to level up')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const stat = int.options.getString('stat')
    let amount = int.options.getInteger('amount') || 1
    const user = app.currency.get(int.user.id);
    if (user.combat) return int.reply('you cannot do that while in combat')
    if (user.level_points <= 0) return int.reply('you do not have any level points')
    if (amount == 'max') amount = user.level_points
    if (isNaN(amount)) return int.reply('please enter a number')
    amount = Math.min(amount, user.level_points)
    user.level_points -= Number(amount)
    user.save()
    let statn
    switch (stat) {
      case 'h':
        statn = 'health'
        user.max_health += Number(amount)
        user.health = user.max_health
        break
      case 'l':
        statn = 'luck'
        user.luck += Number(amount)
        break
      case 's':
        statn = 'strength'
        user.strength += Number(amount)
        break
      case 'd':
        statn = 'dexterity'
        user.dexterity += Number(amount)
        break
      default:
        int.reply(`unknown stat ${args}`)
        break
    }
    user.save()
    func.log(`leveled up their ${stat}`, int, c)
    return int.reply(`${int.user.tag} leveled up their ${statn} ${amount} ${amount > 1 ? `times` : `time`}`)
  }
}