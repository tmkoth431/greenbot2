const { SlashCommandBuilder } = require('@discordjs/builders')
const { Formatters, MessageEmbed } = require('discord.js')

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
    
    let target = int.options.getUser('user') || int.user

    const embededd = new MessageEmbed()
      .setTitle(`${target.username}'s Inventory`)
      .setColor('#25c059')
      .setThumbnail(target.displayAvatarURL())
    
    const user = app.currency.get(target.id);
    if (!user) return int.reply(`${target} does not exist`)
    const items = await user.getItems()
    if (!items.length) {
      func.log(`checked ${target.id} inventory`, int, c)
      embededd.setDescription(`${target.username} does not have any items.`)
      return int.reply({ embeds: [embededd] });
    }
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    let ctext = ''
    let wtext = ''
    let etext = ''
    if (items.filter(a => a.type == 'c' && a.amount > 0).map(i => `${i.item_id}`).join('\n')) ctext = 'Consumables:\n' + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'c' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (items.filter(a => a.type == 'w' && a.amount > 0).map(i => `${i.item_id}`).join('\n')) wtext = `${ctext ? '\n\n' : ''}Weapons:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'w' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (items.filter(a => a.type == 'e' && a.amount > 0).map(i => `${i.item_id}`).join('\n')) etext = `${wtext || ctext ? '\n\n' : ''}Enchantments:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'e' && a.amount > 0).map(item => `[ID: ${item.shop_id}] ${item.amount} ${item.amount >1? `${item.item_id}` + 's' : `${item.item_id}`}`).join('\n')
    if (!weapon) { wep = '' } else { wep = `${etext || wtext || ctext ? '\n\n' : ''}[ID: ${weapon.shop_id}] Equipped:\n${weapon.item_id}` } 
    func.log(`checked ${target.id}'s inventory`, int, c)
    // return int.reply(Formatters.codeBlock('Consumables:\n' +
    // items.sort((a, b) => a.id - b.id).filter(a => a.type === 'c' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Heal: ${item.heal}`).join('\n') + '\n\n' +
    // 'Weapons:\n' +
    // items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Damage: ${item.damage} Attribute: ${item.attribute}`).join('\n') + '\n\n' +
    // 'Enchantments:\n' +
    // items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Enchantment Cost: ${item.ecost}`).join('\n')));

    embededd.setDescription('' + ctext + wtext + etext + wep)
    return int.reply({ embeds: [embededd] })
  },
}