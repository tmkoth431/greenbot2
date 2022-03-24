const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createweapon')
    .setDescription('creates unique weapon')
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
      options.setName('damage')
        .setDescription('damage')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('attribute')
        .setDescription('sets the attribute')
        .setRequired(true)
        .addChoice('none', 'None')
        .addChoice('strength', 'Strength')
        .addChoice('speed', 'Speed'))
    .addIntegerOption(options =>
      options.setName('dmgscale')
        .setDescription('the damage scale'))
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
      int.options.getInteger('damage'),
      int.options.getString('attribute'),
      int.options.getInteger('dmgscale'),
      int.options.getString('desc') || 'no description provided',
      int.options.getInteger('amount') || 1,
    ]

    args[1] = args[1] == 'null' ? null : args[1];

    const user = app.currency.get(int.user.id)
    await user.addUniqueItem(args[0], 'w', args[1], args[2], args[3], args[4], null, null, args[5], args[6])
    func.log(`created ${args[6]} new consumable '${args[0]}': '${args[5]}' ench: ${args[1]}, damage: ${args[2]}, attribute: ${args[3]} dmgscale: ${args[4]}.`, int, c)
    return int.reply(`<@${int.user.id}> created ${args[6] > 1 ? `${args[6]}` : 'a'} new weapon${args[6] > 1 ? 's' : ''}: ${args[0]}.`)
  },
}
