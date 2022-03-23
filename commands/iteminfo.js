const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iteminfo')
    .setDescription('Returns information about an item')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('Item Name')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')
    const embededd = new MessageEmbed()
      .setTitle(`Item Info`)
      .setColor('#25c059')

    const itemName = int.options.getString('item_id')
    const user = app.currency.get(int.user.id);
    let item = await Shop.findOne({ where: { name: itemName } });
    if (!item) {
      item = await Shop.findOne({ where: { id: itemName } });
      if (!item) {
        embededd.setDescription(`Could not find item: ${itemName}!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
    }

    func.log(`is viewing item ${item.name}`, int, c)
    if (item.type === 'c') {
      embededd.setDescription(`[ID: ${item.id}] ${item.name}: ${item.desc}\nEnchantment: ${!item.enchant ? 'none' : `${item.enchant}`}\nHeal: ${!item.heal ? '0' : `${item.heal}`}`);
      return int.reply({ embeds: [embededd] });
    } 
    if (item.type === 'e') {
      embededd.setDescription(`[ID: ${item.id}] ${item.name}: ${item.desc}\nEnchantment: ${!item.enchant ? 'none' : `${item.enchant}`}\nEnchant Cost: ${!item.ecost ? '0' : `${item.ecost}`}`);
      return int.reply({ embeds: [embededd] })
    }
    if (item.type === 'w') {
      embededd.setDescription(`[ID: ${item.id}] ${item.name}: ${item.desc}\nEnchantment: ${!item.enchant ? 'none' : `${item.enchant}`}\nDamage: ${!item.damage ? '0' : `${item.damage}`}\nAttribute: ${!item.attribute ? 'none' : `${item.attribute}`}\nDamage Scale: ${!item.scale ? '0' : `${item.scale}`}`);
      return int.reply({ embeds: [embededd] });
    }
    embededd.setTitle('Error').setDescription(`Invalid Type`).setImage('https://i.imgur.com/tDWLV66.png');
  },
}