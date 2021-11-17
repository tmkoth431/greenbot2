const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('buys an item from the shop')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('item id')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('count')
        .setDescription('amount')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const buyName = int.options.getString('item_id')
    var buyAmmount = int.options.getNumber('count') || 1
    if (!buyName) return int.reply('please enter a item to buy')
    const user = app.currency.get(int.user.id);
    if (user.combat) return int.reply('you cannot do that while in combat')
    let item = await Shop.findOne({ where: { name: buyName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: buyName } });
      if (!item) return int.reply(`could not find item: ${buyName}`)
    }
    if (!item.buyable) return int.reply('cannot buy that item')
    if (buyAmmount == 'max' || buyAmmount == 'all') buyAmmount = Math.floor(user.balance / item.cost)
    if (isNaN(buyAmmount)) return int.reply('please enter an amount to buy')
    const totalCost = item.cost * Number(buyAmmount)
    const bal = user.balance || 0;
    if (totalCost > bal) return int.reply(`you do not have enough money for that`)

    user.balance -= Number(totalCost);
    await user.addItem(item.name, item.id, buyAmmount);
    user.save();

    func.log(`bought ${buyAmmount} ${item.name}`, int, c)
    return int.reply(`You've bought ${buyAmmount} ${item.name}`);
  },
}