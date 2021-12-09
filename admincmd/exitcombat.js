const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exitcombat')
    .setDescription('force exits combat')
    .addStringOption(options =>
      options.setName('user')
        .setDescription('target user id')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Enemy } = require('../dbobjects')

    const id = int.options.getString('user')
    const user = app.currency.get(id)
    await Enemy.destroy({ where: { user_id: user.user_id } })
    const tUser = app.currency.get(user.combat_target_id)
    user.combat = Boolean(false)
    user.turn = Boolean(true)
    user.save()
    tUser.combat = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.save()
    func.log(`says hello`, int, c);
  },
}