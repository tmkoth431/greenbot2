const { SlashCommandBuilder } = require('@discordjs/builders')
const { Formatters } = require('discord.js')

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
    const user = app.currency.get(target.id);
    if (!user) return int.reply(`${target} does not exist`)
    const items = await user.getItems()
    if (!user) return int.reply(`${target} does not exist`)
    if (!items.length) return int.reply(`${target.tag} is poor :(`);
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    let ctext = ''
    let wtext = ''
    let etext = ''
    if (items.filter(a => a.type == 'c' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) ctext = 'consumables:\n' + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'c' && a.amount > 0).map(item => `[${item.shop_id}]${item.amount} ${item.item_id} heal:${item.heal}`).join('\n')
    if (items.filter(a => a.type == 'w' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) wtext = `${ctext ? '\n\n' : ''}weapons:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'w' && a.amount > 0).map(item => `[${item.shop_id}]${item.amount} ${item.item_id} damage:${item.damage} ${item.attribute != 'none' ? `attribute: ${item.attribute}` : ''} ${!item.enchant ? '' : `enchant:${item.enchant}`}`).join('\n')
    if (items.filter(a => a.type == 'e' && a.amount > 0).map(item => `${item.item_id}`).join('\n')) etext = `${wtext || ctext ? '\n\n' : ''}enchantments:\n` + items.sort((a, b) => a.shop_id - b.shop_id).filter(a => a.type === 'e' && a.amount > 0).map(item => `[${item.shop_id}]${item.amount} ${item.item_id}  enchant cost:${item.ecost}`).join('\n')
    if (!weapon) { wep = '' } else { wep = `${etext || wtext || ctext ? '\n\n' : ''}equipped:\n${weapon.item_id} damage:${weapon.damage} ${weapon.attribute != 'none' ? `attribute: ${weapon.attribute}` : ''} ${!weapon.enchant ? '' : `enchant:${weapon.enchant}`}` } func.log(`checked <${target.id}> inventory`, int, c)
    return int.reply(Formatters.codeBlock('Consumables:\n' +
    items.sort((a, b) => a.id - b.id).filter(a => a.type === 'c' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Heal: ${item.heal}`).join('\n') + '\n\n' +
    'Weapons:\n' +
    items.sort((a, b) => a.id - b.id).filter(a => a.type === 'w' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Damage: ${item.damage} Attribute: ${item.attribute}`).join('\n') + '\n\n' +
    'Enchantments:\n' +
    items.sort((a, b) => a.id - b.id).filter(a => a.type === 'e' && a.buyable).map(item => `[ID: ${item.id}] ${item.name}: \$${item.cost} Enchantment Cost: ${item.ecost}`).join('\n')));
  },
}