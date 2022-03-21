const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Formatters } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level up')
    .addStringOption(options =>
      options.setName('stat')
        .setDescription('Stat to level up')
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
    const embededd = new MessageEmbed()
      .setTitle(`Level`)
      .setColor('#25c059')

    const stat = int.options.getString('stat')
    let amount = int.options.getInteger('amount')
    const user = app.currency.get(int.user.id);
    if (user.combat) {
      embededd.setDescription('You cannot level up while in combat!').setThumbnail('../assets/images/x_image.png')
      return int.reply({ embeds: [embededd] })
    }
    if (user.level_points <= 0) {
      embededd.setDescription('You do not have any level points!').setThumbnail('../assets/images/x_image.png')
      return int.reply({ embeds: [embededd] })
    }
    if (amount == 'max') amount = user.level_points
    if (isNaN(amount)) {
      embededd.setDescription('Please enter a number!').setThumbnail('../assets/images/x_image.png')
      return int.reply({ embeds: [embededd] })
    }
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
        int.reply(`${args} is not a stat!`)
        break
    }
    user.save()

    func.log(`leveled up their ${statn}`, int, c)
    embededd.setDescription(`${int.user.tag} leveled up their ${statn} ${amount} ${amount > 1 ? `times` : `time`}`)
    return int.reply({ embeds: [embededd] })
  }
}