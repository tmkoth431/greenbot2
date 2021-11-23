const { SlashCommandBuilder } = require('@discordjs/builders')
const { Formatters } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('gets user stats')
    .addUserOption(options =>
      options.setName('user')
        .setDescription('target user')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')

    const target = int.options.getUser('user') ?? int.user;
    const user = app.currency.get(target.id)
    if (!user) return int.reply(`${target.tag} was not found`)
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
    let effects = ''
    if (userEffects.burn > 0) effects += `\nburn: ${userEffects.burn}`
    if (userEffects.poison > 0) effects += `\npoison: ${userEffects.poison}`
    if (user.curse) effects += `\nCURSED`
    if (!weapon) { wep = 'none' } else { wep = weapon.item_id }
    const enemy = await Enemy.findOne({ where: { user_id: int.user.id } })
    func.log(`is checking the stats of ${target}`, int, c)
    return int.reply(Formatters.codeBlock(`${target.tag}'s stats: \n` +
      `level: ${user.level}  ${user.exp}/${func.calclvl(user.level)}\n` +
      `points: ${user.level_points}\n` +
      `health: ${user.health}/${user.max_health} \n` +
      `luck: ${user.luck} \n` +
      `strength: ${user.strength}\n` +
      `dexterity: ${user.dexterity}\n` +
      `fish exp: ${user.fish_exp}\n` +
      `biggest fish: ${user.biggest_catch}\n` +
      `weapon: ${wep}\n` +
      `status:${effects}` +
      `${enemy ? `\n\nEnemy:\n` +
        `name: ${enemy.name}\n` +
        `health: ${enemy.health}/${enemy.max_health}` : ''}`
      ))

  }
}