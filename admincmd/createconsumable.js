const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createconsumable')
    .setDescription('creates unique consumable')
    .addStringOption(options =>
      options.setName('item')
        .setDescription('item name')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('ench')
        .setDescription('enchantment for the item')
        .setRequired(true)
        .addChoice('none', 'null')
        .addChoice('antidote', 'antidote')
        .addChoice('curse', 'curse')
        .addChoice('curseremoval', 'curseremoval')
        .addChoice('XP', 'exp')
        .addChoice('fishing', 'fishing')
        .addChoice('flame', 'flame')
        .addChoice('mystery', 'mystery')
        .addChoice('necrofire', 'necrofire')
        .addChoice('poison', 'poison')
        .addChoice('randomness', 'randomness')
        .addChoice('water', 'water'))
    .addIntegerOption(options =>
      options.setName('heal')
        .setDescription('heal')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('desc')
        .setDescription('The description of the item')
        .setRequired(false))
    .addIntegerOption(options =>
      options.setName('amount')
        .setDescription('amount')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const args = [
      int.options.getString('item'),
      int.options.getString('ench'),
      int.options.getInteger('heal'),
      int.options.getString('desc') || 'no description provided',
      int.options.getInteger('amount') || 1,
    ]
    const user = app.currency.get(int.user.id)
    await user.addUniqueItem(args[0], 'c', args[1], null, null, null, args[2], null, args[3], args[4])
    func.log(`created new consumable '${args[0]}': '${args[3]}' ench: ${args[2]}, heal: ${args[2]}.`, int, c)
    return int.reply(`<@${int.user.id}> created ${args[4] > 1 ? `${args[4]}` : 'a'} new consumable${args[4] > 1 ? 's' : ''} ${args[0]}: ${args[3]} ench: ${args[1]}, heal: ${args[2]}.`)
  },
}