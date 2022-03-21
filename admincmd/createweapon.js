const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createweapon')
    .setDescription('creates unique item')
    .addStringOption(options =>
      options.setName('item')
        .setDescription('item name')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('type')
        .setDescription('type of weapon')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('ench')
        .setDescription('enchant name')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('dmg')
        .setDescription('damage')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('attr')
        .setDescription('atribute')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('scale')
        .setDescription('damage scaling')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('heal')
        .setDescription('heal')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('ecost')
        .setDescription('enchantment cost')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('amount')
        .setDescription('amount')
        .setRequired(true)),
    // .setDefaultPermission(false)
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const args = [
      int.options.getString('item'),
      int.options.getString('type'),
      int.options.getString('ench'),
      int.options.getString('dmg'),
      int.options.getString('attr'),
      int.options.getString('scale'),
      int.options.getString('heal'),
      int.options.getString('ecost'),
      int.options.getString('amount')
    ]
    const user = app.currency.get(int.user.id)
    if (!args[0]) return int.reply('item, type, enchant, damage, attribute, scale, heal, ecost, amount')
    func.log(`created an item`, int, c)
    await user.addUniqueItem(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])
    return int.reply('created: ' + args[0] + args[1] + args[2] + args[3] + args[4] + args[5] + args[6] + args[7] + args[8])
  },
}