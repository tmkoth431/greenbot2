const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equip')
    .setDescription('Equips/unequips your weapon')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('ID of the weapon you wish to equip/unequip')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')
    const { Op } = require('sequelize');
    const embededd = new MessageEmbed()
      .setTitle(`Equip`)
      .setColor('#25c059')

    const name = int.options.getString('item_id') || 'none'
    if (name == 'none') {
      let weapon = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
      if (!weapon) {
        embededd.setDescription('Please enter the ID of the weapon you wish to equip.').setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
      weapon.equipped = Boolean(false)
      weapon.save()

      func.log(`unequipped ${weapon.item_id}`, int, c);
      embededd.setDescription(`<@${int.user.id}> unequipped ${weapon.item_id}.`)
      return int.reply({ embeds: [embededd] });
    }
    const user = app.currency.get(int.user.id)
    let weapon = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: name } } })
    if (!weapon) {
      weapon = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: name } })
      if (!weapon) {
        embededd.setDescription('Could not find that item!').setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
      if (weapon.amount <= 0) {
        embededd.setDescription(`You do not have any ${weapon.name}'s!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
      if (weapon.type != 'w') {
        embededd.setDescription(`${name} is not a weapon!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
    }
    if (weapon.amount <= 0) {
      embededd.setDescription(`You do not have any ${weapon.name}'s!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    if (weapon.type != 'w') {
      embededd.setDescription(`${name} is not a weapon!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    await user.equip(weapon.item_id)

    func.log(`equipped ${weapon.item_id}`, int, c);
    embededd.setDescription(`<@${int.user.id}> equipped ${weapon.item_id}.`)
    return int.reply({ embeds: [embededd] });
  },
}