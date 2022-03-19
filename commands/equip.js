const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equip')
    .setDescription('Equips/Unequips Weapons')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('ID of the Weapon You Want to Equip/Unequip')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')
    const { Op } = require('sequelize');

    const name = int.options.getString('item_id') || 'none'
    if (name == 'none') {
      let weapon = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
      if (!weapon) return int.reply('Please enter the ID of the weapon you want to equip.')
      weapon.equipped = Boolean(false)
      weapon.save()
      func.log(`dequipped ${weapon.item_id}`, int, c);
      return int.reply(`${int.user.username} dequipped ${weapon.item_id}.`);
    }
    const user = app.currency.get(int.user.id)
    let weapon = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: name } } })
    if (!weapon) {
      weapon = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: name } })
      if (!weapon) return int.reply('Could not find that item!')
    }
    if (weapon.amount <= 0) return int.reply('You do not have any of those!')
    if (weapon.type != 'w') return int.reply(`${name} is not a weapon!`)
    await user.equip(weapon.item_id)
    func.log(`equipped ${weapon.item_id}`, int, c);
    return int.reply(`${int.user.username} equipped ${weapon.item_id}.`);
  },
}