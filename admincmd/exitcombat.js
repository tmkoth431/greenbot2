const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('exitcombat')
    .setDescription('Force exits combat')
    .addStringOption(options =>
      options.setName('user')
        .setDescription('Targeted user\'s ID')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Enemy } = require('../dbobjects')

    const id = int.options.getString('user')
    const user = app.currency.get(id)
    if (!user) {
      func.log(`attempted to force an unrecognized player out of combat`, int, c)
      return int.reply(`<@${id}> is not initialized!`)
    }
    if (!user.combat) {
      func.log(`attempted to force ${id} out of combat when they were not in combat`, int, c)
      return int.reply(`<@${id}> is not in combat.`)
    }
    await Enemy.destroy({ where: { user_id: user.user_id } })
    const tUser = app.currency.get(user.combat_target_id)
    user.combat = Boolean(false)
    user.turn = Boolean(true)
    user.save()
    tUser.combat = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.save()
    func.log(`forcefully removed ${user.combat_target_id} from combat`, int, c);
    return int.reply(`forcefully removed <@${user.combat_target_id}> from combat.`)
  },
}