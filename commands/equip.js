const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equip')
    .setDescription('equip/dequips a weapon')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('item id')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')
    const { Op } = require('sequelize');

    const name = int.options.getString('item_id') || 'none'
    if (name == 'none') {
      let weapon = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
      if (!weapon) return int.reply('please enter an weapon to equip')
      weapon.equipped = Boolean(false)
      weapon.save()
      func.log(`dequipped ${weapon.item_id}`, int, c);
      return int.reply(`${int.user.tag} dequipped ${weapon.item_id}`);
    }
    const user = app.currency.get(int.user.id)
    let weapon = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: name } } })
    if (!weapon) {
      weapon = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: name } })
      if (!weapon) return int.reply('could not find that item')
    }
    if (weapon.amount <= 0) return int.reply('you do not have any of that item')
    if (weapon.type != 'w') return int.reply(`${name} is not a weapon`)
    await user.equip(weapon.item_id)
    func.log(`equipped ${weapon.item_id}`, int, c);
    return int.reply(`${int.user.tag} equipped ${weapon.item_id}`);
  },
}