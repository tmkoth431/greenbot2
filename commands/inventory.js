const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription("Shows Items in a Players' inventory.")
    .addUserOption(options =>
      options.setName('user')
        .setDescription('Targeted User')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')

    let target = int.options.getUser('user') || int.user;

    const embededd = new MessageEmbed()
      .setTitle(`${target.username}'s Inventory`)
      .setColor('#25c059')
      .setThumbnail(target.displayAvatarURL())
    
    const user = app.currency.get(target.id);
    if (!user) {
      func.log(`attempted to view the inventory of an unrecognized player`, int, c)
      return int.reply(`${target} does not exist`)
    }
    const items = await user.getItems()
    if (!items.length) {
      func.log(`checked ${target.id}'s inventory`, int, c)
      embededd.setDescription(`<@${target.id}> does not have any items.`)
      return int.reply({ embeds: [embededd] });
    }
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    let ctext = ''
    let wtext = ''
    let etext = ''
    if (items.filter(a => a.type == 'c' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) ctext = 'Consumables:\n' + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'c' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount > 1 ? `${item.amount}` : ''} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (items.filter(a => a.type == 'w' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) wtext = `${ctext ? '\n\n' : ''}Weapons:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'w' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount > 1 ? `${item.amount}` : ''} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (items.filter(a => a.type == 'e' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) etext = `${wtext || ctext ? '\n\n' : ''}Enchantments:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'e' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount > 1 ? `${item.amount}` : ''} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (!weapon) { wep = '' } else { wep = `${etext || wtext || ctext ? '\n\n' : ''}Equipped:\n[ID: ${weapon.shop_id}] ${weapon.item_id}` } 
    func.log(`checked ${target.id}'s inventory`, int, c)
    
    embededd.setDescription('' + ctext + wtext + etext + wep)
    return int.reply({ embeds: [embededd] })
  },
}