const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editstat')
    .setDescription('edits a users stat')
    .addStringOption(options =>
      options.setName('user')
        .setDescription('target user id')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('stat')
        .setDescription('target stat to change')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('val')
        .setDescription('value')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const args = [
      int.options.getString('user'),
      int.options.getString('stat'),
      int.options.getString('val')
    ]
    const user = app.currency.get(args[0])
    if (!user) return int.reply(`could not find user ${args[0]}`)
    switch (args[1]) {
      case 'adventure':
        user.adventure = Boolean(args[2])
        user.save()
        break
      case 'leaderboard':
        user.leaderboard = Boolean(args[2])
        user.save()
        break
      case 'level':
        user.level = Number(args[2])
        user.save()
        break
      case 'exp':
        user.exp = Number(args[2])
        user.save()
        break
      case 'level_points':
        user.level_points = Number(args[2])
        user.save()
        break
      case 'turn':
        user.turn = Boolean(args[2])
        user.save()
        break
      case 'combat':
        user.combat = Boolean(args[2])
        user.save()
        break
      case 'combat_target_id':
        user.combat_target_id = args[2]
        user.save()
        break
      case 'combat_target':
        user.combat_target = args[2]
        user.save()
        break
      case 'max_health':
        user.max_health = Number(args[2])
        user.save()
        break
      case 'health':
        user.health = Number(args[2])
        user.save()
        break
      case 'balance':
        user.balance = Number(args[2])
        user.save()
        break
      case 'fish_exp':
        user.fish_exp = Number(args[2])
        user.save()
        break
      case 'biggest_catch':
        user.biggest_catch = Number(args[2])
        user.save()
        break
      case 'crime_exp':
        user.crime_exp = Number(args[2])
        user.save()
        break
      case 'combat_exp':
        user.combat_exp = Number(args[2])
        user.save()
        break
      case 'luck':
        user.luck = Number(args[2])
        user.save()
        break
      case 'strength':
        user.strength = Number(args[2])
        user.save()
        break
      case 'dexterity':
        user.dexterity = Number(args[2])
        user.save()
        break
      case 'curse':
        user.curse = Boolean(args[2])
        user.save()
        break
      case 'curse_time':
        user.curse_time = Number(args[2])
        user.save()
        break
    }
    func.log(`changed <${args[0]}> ${args[1]} to ${args[2]}`, int, c);
    return int.reply(`changed <${args[0]}> ${args[1]} to ${args[2]}`)
  },
}