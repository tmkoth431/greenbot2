const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buys an Item From the Shop')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('Item Name')
        .setRequired(true))
    .addNumberOption(options =>
      options.setName('count')
        .setDescription('Amount to be Purchased')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')
    const embededd = new MessageEmbed()
      .setTitle(`Buy`)
      .setColor('#25c059')

    const buyName = int.options.getString('item_id')
    var buyAmmount = int.options.getNumber('count') || 1
    const user = app.currency.get(int.user.id);
    if (user.combat) {
      embededd.setDescription('You cannot purchase an item while in combat.').setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    let item = await Shop.findOne({ where: { name: buyName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: buyName } });
      if (!item) {
        embededd.setDescription(`Could not find ${buyName}!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
    }
    if (!item.buyable) {
      embededd.setDescription('Unable to purchase that item!').setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    if (buyAmmount == 'max' || buyAmmount == 'all') buyAmmount = Math.floor(user.balance / item.cost)
    if (isNaN(buyAmmount)) {
      embededd.setDescription('Please select an amount!').setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    const totalCost = item.cost * Number(buyAmmount)
    const bal = user.balance || 0;
    if (totalCost > bal) {
      embededd.setDescription('No enough money!').setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }

    user.balance -= Number(totalCost);
    await user.addItem(item.name, item.id, buyAmmount);
    user.save();

    func.log(`bought ${buyAmmount} ${item.name}`, int, c)
    embededd.setDescription(`${int.user.username} bought ${buyAmmount} ${buyAmmount > 1 ? `${item.name}` + 's' : `${item.name}`}.`)
    return int.reply({ embeds: [embededd] });
  },
}