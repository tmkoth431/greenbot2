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
        func.log(`attempted to remove a weapon from ${player} that they don't have`, int, c)
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
        func.log(`attempted to add a non-existant item to ${player}'s equip`, int, c)
        return int.reply('couldn\'t find that item')
      }
    }
    if (weapon.amount <= 0) {
      func.log(`attempted to remove ${weapon.item_id} from ${player} when they didn't have it equipped`, int, c)
      return int.reply(`<@${player}> does not have any ${weapon.name}'s`)
    }
    if (weapon.type != 'w') {
      func.log(`attempted to add ${weapon.item_id} to ${player}'s equip, when it is not a weapon`, int, c)
      return int.reply(`${weapon.name} is not a weapon`)
    }
    const user = app.currency.get(player)

    await user.equip(weapon.item_id)

    func.log(`set ${player}'s equip to ${weapon.item_id}`, int, c);
    return int.reply(`set <@${player}>'s equip to ${weapon.item_id}`);
  },
}