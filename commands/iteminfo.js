const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iteminfo')
    .setDescription('gets info on an item')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('item id')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const itemName = int.options.getString('item_id')
    if (!itemName) return int.reply('please enter a item name/id')
    const user = app.currency.get(int.user.id);
    let item = await Shop.findOne({ where: { name: itemName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: itemName } });
      if (!item) return int.reply(`could not find item: ${itemName}`)
    }

    func.log(`is veiwing item ${item.name}`, int, c)
    return int.reply(`[ID:${item.shop_id}] ${item.name}: ${item.desc}`);
  },
}