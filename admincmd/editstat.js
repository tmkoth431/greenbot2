const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('editstat')
    .setDescription('Edits a user\'s statistics')
    .addStringOption(options =>
      options.setName('user')
        .setDescription('The targeted user\'s ID')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('stat')
        .setDescription('The statistic to change')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('val')
        .setDescription('New value')
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
    if (!user) return int.reply(`Couldn\'t find the user ${args[0]}!`)
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
        user.level = Math.round(args[2])
        user.save()
        break
      case 'exp':
        user.exp = Math.round(args[2])
        user.save()
        break
      case 'level_points':
        user.level_points = Math.round(args[2])
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
        user.max_health = Math.round(args[2])
        user.save()
        break
      case 'health':
        user.health = Math.round(args[2])
        user.save()
        break
      case 'balance':
        user.balance = Math.round(args[2])
        user.save()
        break
      case 'fish_exp':
        user.fish_exp = Math.round(args[2])
        user.save()
        break
      case 'biggest_catch':
        user.biggest_catch = Math.round(args[2])
        user.save()
        break
      case 'crime_exp':
        user.crime_exp = Math.round(args[2])
        user.save()
        break
      case 'combat_exp':
        user.combat_exp = Math.round(args[2])
        user.save()
        break
      case 'luck':
        user.luck = Math.round(args[2])
        user.save()
        break
      case 'strength':
        user.strength = Math.round(args[2])
        user.save()
        break
      case 'dexterity':
        user.dexterity = Math.round(args[2])
        user.save()
        break
      case 'curse':
        user.curse = Boolean(args[2])
        user.save()
        break
      case 'curse_time':
        user.curse_time = Math.round(args[2])
        user.save()
        break
      case 'death_count':
        user.curse_time = Math.round(args[2])
        user.save()
        break
      default:
        return int.reply(`${args[1]} is not a changeable value!`)
    }
    func.log(`changed ${args[0]}\'s ${args[1]} to ${args[2]}`, int, c);
    return int.reply(`Successfully changed <@${args[0]}>\'s ${args[1]} to ${args[2]}!`)
  },
}