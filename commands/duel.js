const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duel')
    .setDescription('starts combat with target user')
    .addUserOption(options =>
      options.setName('user')
        .setDescription('target user')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')

    const target = int.options.getUser('item_id')
    const user = app.currency.get(int.user.id)
    if (!args[0]) {
      if (!user.combat) return int.reply('you are not in combat, mention a user to start')
      return int.reply(`you are in combat with ${user.combat_target}\n`
        + `it is ${user.turn ? 'your turn' : 'not your turn'}`
        + `attack: attacks player you are currently in combat with\n`
        + `run: attemt to flee from combat`, { code: true })
    }
    const tUser = app.currency.get(target.id)
    const equipped = await UserItems.findOne({ where: { user_id: int.user.id, equipped: true } })
    const tEquipped = await UserItems.findOne({ where: { user_id: target.id, equipped: true } })
    if (!tUser || !target) return int.reply('unnable to find that user')
    if (user.combat) return int.reply('you are unnable to initiate combat')
    if (tUser.combat) return int.reply('that player is already in combat')
    if (!equipped) return int.reply('you cannot enter combat without a weapon')
    if (!tEquipped) return int.reply('your target does not have a weapon')
    if (Number(tUser.health / tUser.max_health) < Number(3 / 4)) return int.reply('that player is too low health')

    user.combat = Boolean(true)
    user.combat_target = target.username
    user.combat_target_id = target.id
    user.combat_exp += Number(1)
    user.turn = Boolean(false)
    tUser.combat = Boolean(true)
    tUser.combat_target = int.user.tag
    tUser.combat_target_id = int.user.id
    tUser.combat_exp += Number(1)
    tUser.turn = Boolean(true)
    user.save()
    tUser.save()

    func.log(`initiated combat with <@${target.id}>`, int, c);
    int.channel.send(`${int.user.username} initiated combat with ${target.username}`);
    return int.channel.send(`<@${tUser.user_id}>, it is your turn`)
  },
}