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
    if (!user) return int.reply(`${target.username} does not exist!`)
    let wep
    const weapon = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: target.id } })
    let effects = ''
    if (userEffects.burn > 0) effects += `\nburn: ${userEffects.burn}`
    if (userEffects.poison > 0) effects += `\npoison: ${userEffects.poison}`
    if (user.curse) effects += `\nCURSED`
    if (!weapon) { wep = 'No Weapon Eqipped' } else { wep = weapon.item_id }
    const enemy = await Enemy.findOne({ where: { user_id: target.id } })
    func.log(`is checking the stats of ${target}`, int, c)
    // return int.reply(`${target.username}'s stats: \n` +
    //   `Level: ${user.level}  ${user.exp}/${func.calclvl(user.level)}\n` +
    //   `Points: ${user.level_points}\n` +
    //   `Health: ${user.health}/${user.max_health} \n` +
    //   `Luck: ${user.luck} \n` +
    //   `Strength: ${user.strength}\n` +
    //   `Dexterity: ${user.dexterity}\n` +
    //   `Fish XP: ${user.fish_exp}\n` +
    //   `Biggest Fish: ${user.biggest_catch}\n` +
    //   `Weapon: ${wep}\n` +
    //   `Status:${effects}` +
    //   `${enemy ? `\n\nEnemy:\n` +
    //     `Name: ${enemy.name}\n` +
    //     `Health: ${enemy.health}/${enemy.max_health}` : ''}`
    //   , { code: true })
    const embededd = new MessageEmbed()
      .setTitle(`${int.user.username}'s Stats: \n`)
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
        `Weapon: ${wep}` + '\n' +
        `${effects ? `Status:${effects}` + '\n' : ''}` +
        `${enemy ? `\nEnemy:\n 
          Name: ${enemy.name}\n
          Health: ${enemy.health}/${enemy.max_health}` : ''}`)
        .setThumbnail(target.displayAvatarURL())
    return int.reply({ embeds: [embededd] })
  }
}