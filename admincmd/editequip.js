const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('editequip')
    .setDescription('changes the equip of another player')
    .addStringOption(options =>
      options.setName('user_id')
      .setDescription('id of the player')
      .setRequired(true))
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('id of the new equip')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')
    const { Op } = require('sequelize');

    const player = int.options.getString('user_id')
    const name = int.options.getString('item_id') || 'none'
    if (name == 'none') {
      let weapon = await UserItems.findOne({ where: { user_id: player, equipped: true } })
      if (!weapon) {
        return int.reply(`<@${player}> does not have anything equipped.`)
      }
      weapon.equipped = Boolean(false)
      weapon.save()

      func.log(`unequipped ${weapon.item_id}`, int, c);
      return int.reply(`uneqipped ${weapon.name} from <@${player}>`);
    }
    let weapon = await UserItems.findOne({ where: { user_id: player, item_id: { [Op.like]: name } } })
    if (!weapon) {
      weapon = await UserItems.findOne({ where: { user_id: player, shop_id: name } })
      if (!weapon) {
        return int.reply('couldn\'t find that item')
      }
    }
    if (weapon.amount <= 0) {
      return int.reply(`<@${player}> does not have any ${weapon.name}'s`)
    }
    if (weapon.type != 'w') {
      return int.reply(`${weapon.name} is not a weapon`)
    }
    const user = app.currency.get(player)

    await user.equip(weapon.item_id)

    func.log(`set ${player}'s equip to ${weapon.item_id}`, int, c);
    return int.reply(`set <@${player}>'s equip to ${weapon.item_id}`);
  },
}