const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription("Retrives a Users' Stats")
    .addUserOption(options =>
      options.setName('user')
        .setDescription('Targeted User')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')

    const target = int.options.getUser('user') ?? int.user;
    const user = app.currency.get(target.id)
    if (!user) return int.reply(`${target.username} does not exist!`)
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
    return int.reply(`${target.username}'s stats: \n` +
      `Level: ${user.level}  ${user.exp}/${func.calclvl(user.level)}\n` +
      `Points: ${user.level_points}\n` +
      `Health: ${user.health}/${user.max_health} \n` +
      `Luck: ${user.luck} \n` +
      `Strength: ${user.strength}\n` +
      `Dexterity: ${user.dexterity}\n` +
      `Fish XP: ${user.fish_exp}\n` +
      `Biggest Fish: ${user.biggest_catch}\n` +
      `Weapon: ${wep}\n` +
      `Status:${effects}` +
      `${enemy ? `\n\nEnemy:\n` +
        `Name: ${enemy.name}\n` +
        `Health: ${enemy.health}/${enemy.max_health}` : ''}`
      , { code: true })

  }
}