const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

// THIS IS COMPLETELY FUCKING BROKEN I LITERALLY WASTED ABOUT 5 HOURS OF MY LIFE TOTAL TRYING TO FIX IT BUT IT IS TOTALLY FUCKED
// ok i actually just forgot to add a + between strings

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription("Retrives a Users' Stats")
    .addUserOption(options =>
      options.setName('user')
        .setDescription('Targeted User')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')

    const target = int.options.getUser('user') || int.user;
    const user = app.currency.get(target.id)
    if (!user) {
      func.log(`attempted to view the stats of an unrecognized player`, int, c)
      return int.reply(`<@${target.id}> is not initialized!`)
    }
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: target.id } })
    let effects = ''
    if (userEffects.burn > 0) effects += `\nburn: ${userEffects.burn}`
    if (userEffects.poison > 0) effects += `\npoison: ${userEffects.poison}`
    if (user.curse) effects += `\nCURSED`
    let wepEquipped;
    if (!weapon) { wep = 'No Weapon Eqipped'; wepEquipped = false } else { wep = weapon.item_id; wepEquipped = true }
    const enemy = await Enemy.findOne({ where: { user_id: target.id } })

    func.log(`is checking the stats of ${target.id}`, int, c)

    const embededd = new MessageEmbed()
      .setTitle(`${target.username}'s Stats: \n`)
      .setColor('#25c059')
      .setDescription(`XP Level: ${user.level}, XP: ${user.exp}/${func.calclvl(user.level)}` + '\n' +
        `XP Level Points: ${user.level_points}` + '\n' +
        `Money: ${user.balance}` + '\n' +
        `Health: ${user.health}/${user.max_health}` + '\n' +
        `Luck: ${user.luck}` + '\n' +
        `Strength: ${user.strength}` + '\n' +
        `Dexterity: ${user.dexterity}` + '\n' +
        `Fish XP: ${user.fish_exp}` + '\n' +
        `Biggest Fish: ${user.biggest_catch}` + '\n' +
        `Death Count: ${user.death_count}` +
        `${wepEquipped ? `\nWeapon: ${wep}` : ''}\n` +
        `${user.combat ? `\nOpponent: <@${user.combat_target_id}>` : ''}\n` +
        `${effects ? `Status:${effects}` + '\n' : ''}` +
        `${enemy ? `\nEnemy:\n 
          Name: ${enemy.name}\n
          Health: ${enemy.health}/${enemy.max_health}` : ''}`)
        .setThumbnail(target.displayAvatarURL())
    return int.reply({ embeds: [embededd] })
  }
}