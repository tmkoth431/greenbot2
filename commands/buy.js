const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buys an Item From the Shop')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('Item ID')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('count')
        .setDescription('Amount to be Purchased')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const buyName = int.options.getString('item_id')
    var buyAmmount = int.options.getNumber('count') || 1
    if (!buyName) return int.reply('Please select an item!')
    const user = app.currency.get(int.user.id);
    if (user.combat) return int.reply('You cannot purchase an item while in combat.')
    let item = await Shop.findOne({ where: { name: buyName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: buyName } });
      if (!item) return int.reply(`Could not find ${buyName}!`)
    }
    if (!item.buyable) return int.reply('Unable to purchase that item!')
    if (buyAmmount == 'max' || buyAmmount == 'all') buyAmmount = Math.floor(user.balance / item.cost)
    if (isNaN(buyAmmount)) return int.reply('Please select an amount!')
    const totalCost = item.cost * Number(buyAmmount)
    const bal = user.balance || 0;
    if (totalCost > bal) return int.reply(`Not enough money!`)

    user.balance -= Number(totalCost);
    await user.addItem(item.name, item.id, buyAmmount);
    user.save();

    func.log(`bought ${buyAmmount} ${item.name}`, int, c)
    return int.reply(`${int.user.username} bought ${buyAmmount} ${buyAmmount >1? `${item.name}` + 's' : `${item.name}`}.`);
  },
}