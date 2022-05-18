const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createenchant')
    .setDescription('creates an enchant')
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
      options.setName('ecost')
        .setDescription('cost to enchant')
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
      int.options.getInteger('ecost'),
      int.options.getString('desc') || 'no description provided',
      int.options.getInteger('amount') || 1,
    ]
    const user = app.currency.get(int.user.id)
    await user.addUniqueItem(args[0], 'e', args[1], null, null, null, null, args[2], args[3], args[4])
    func.log(`created new enchant '${args[0]}': '${args[3]}' ench: ${args[1]}, ecost: ${args[2]}.`, int, c)
    return int.reply(`<@${int.user.id}> created ${args[4] > 1 ? `${args[4]}` : 'a'} new enchant${args[4] > 1 ? 's' : ''}: ${args[0]}.`)
  },
}