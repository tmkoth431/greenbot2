const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pricechange')
    .setDescription('changes the price of an item in the shop')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('item id')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('price')
        .setDescription('price')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const name = int.options.getString('item_id')
    const price = int.options.getNumber('price') || 1
    let item = await Shop.findOne({ where: { name: name } })
    if (!item) item = await Shop.findOne({ where: { id: name } })
    if (!item) return int.reply('not an item')
    item.cost = Math.round(price)
    func.log(`changed the price of an item`, int, c)
    item.save()
    return int.reply(`changed the price of ${item.name} to ${price}`)
  },
}