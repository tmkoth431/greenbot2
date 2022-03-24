const { SlashCommandBuilder } = require('@discordjs/builders')
const Shop = require('../models/Shop')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('gives an item to target player')
    .addUserOption(options =>
      options.setName('target')
        .setDescription('user you want to give item to')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('item')
        .setDescription('item id')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('amount')
        .setDescription('amount of the item you want to give')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, Shop } = require('../dbobjects')
    const { Op } = require('sequelize');

    const target = int.options.getUser('target')
    const id = int.options.getString('item')
    const amount = int.options.getNumber('amount') || 1
    const tUser = app.currency.get(target.id)
    let item = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: id }, amount: { [Op.gte]: amount } } })
    if (!item) {
      item = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: id, amount: { [Op.gte]: amount } } })
      if (!item) return int.reply(`invalid item ID:${id}`)
    }
    // item, type, enchant, damage, attribute, scale, heal, ecost, desc, amount
    await tUser.addItemShopItem(item.shop_id, amount)
    item.amount -= Number(amount)
    item.save()
    func.log(`gave ${target.id} ${amount} ${item.item_id}`, int, c)
    return int.reply(`you gave <@${target.id}> ${amount} ${item.item_id}`)
  },
}