const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { Formatters, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('displays shop'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')
    
    const items = await Shop.findAll();
    func.log(`opened the shop`, int, c)
    const embededd = new MessageEmbed()
      .setTitle('Shop')
      .setColor('#25c059')
      .setDescription('Consumables:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'c' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Heal: ${item.heal}`).join('\n') + '\n\n' +
      'Weapons:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Damage: ${item.damage} Attribute: ${item.attribute}`).join('\n') + '\n\n' +
      'Enchantments:\n' +
      items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Enchantment Cost: ${item.ecost}`).join('\n'))
    return int.reply({ embeds: [embededd] })
    },
} 