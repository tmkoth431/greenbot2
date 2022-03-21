const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('pricechange')
    .setDescription('Changes the price of an item in the shop')
    .addNumberOption(options =>
      options.setName('item_id')
        .setDescription('Targeted item ID')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('price')
        .setDescription('New price')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const name = int.options.getNumber('item_id')
    const price = int.options.getNumber('price') || 1
    let item = await Shop.findOne({ where: { id: name } })
    let originalPrice = item.cost;
    if (!item) return int.reply(`${item.name} is not an item!`)
    item.cost = Number(price)
    func.log(`changed the price of ${item.name} to ${item.cost}`, int, c)
    item.save()
    return int.reply(`changed the price of [ID: ${item.id}] ${item.name} from ${originalPrice} to ${item.cost}`)
  },
}