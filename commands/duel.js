const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duel')
    .setDescription('Starts combat with the targetted user')
    .addUserOption(options =>
      options.setName('user')
        .setDescription('Target user')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')
    const embededd = new MessageEmbed()
      .setTitle(`Duel`)
      .setColor('#25c059')

    const target = int.options.getUser('user')
    const user = app.currency.get(int.user.id)
    const tUser = app.currency.get(target.id)
    const equipped = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
    const tEquipped = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    if (!tUser || !target) {
      embededd.setDescription(`Unable to find ${target.username}`).setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (user.combat) {
      embededd.setDescription('You are already in combat!').setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (tUser.combat) {
      embededd.setDescription(`${target.username} is already in combat!`).setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (!equipped) {
      embededd.setDescription('You cannot enter combat without a weapon!').setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (!tEquipped) {
      embededd.setDescription(`${target.username} does not have a weapon!`).setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (Number(tUser.health / tUser.max_health) < Number(3 / 4)) {
      embededd.setDescription(`${target.username} has too little health!`).setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }

    user.combat = Boolean(true)
    user.combat_target = target.username
    user.combat_target_id = target.id
    user.combat_exp += Number(1)
    user.turn = Boolean(false)
    user.save()
    tUser.combat = Boolean(true)
    tUser.combat_target = int.user.username
    tUser.combat_target_id = int.user.id
    tUser.combat_exp += Number(1)
    tUser.turn = Boolean(true)
    tUser.save()

    func.log(`initiated combat with ${target.id}`, int, c);
    embededd.setDescription(`${int.user.username} initiated combat with <@${target.id}>\n\nIt is ${user.combat_target}'s turn`)
    return int.reply({ embeds: [embededd] })
  },
}