const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('run')
    .setDescription('attempt to flee from combat'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')

    const user = app.currency.get(int.user.id)
    if (!user.combat) return int.reply('you are not in combat')
    if (!user.turn) return int.reply('not your turn')
    let rand = Math.random() * 4

    if (user.combat_target_id == '0') {
      const enemy = await Enemy.findOne({ where: { user_id: int.user.id } })
      const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
      let erand = Math.round(((Math.random() - 0.5) * 2) + (enemy.damage))
      let ecrit = Boolean((Math.round(Math.random() * 100) + 5) > 99)
      if (ecrit) erand * 2
      user.health -= Number(erand)
      user.save()
      if (!ecrit) { int.reply(`${int.user.tag} was hit by ${enemy.name} for ${erand}`); }
      else { int.reply(`${int.user.tag} was CRIT by ${enemy.name} for ${erand}`) }
      if (user.health < 1) {
        user.combat = Boolean(false)
        user.save()
        func.die(int, `was killed by the ${enemy.name}`, user, userEffects, c)
        return await Enemy.destroy({ where: { user_id: int.user.id } })
      }
    }

    const tUser = app.currency.get(user.combat_target_id)
    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    user.save()
    tUser.save()

    if (rand < 3) {
      int.reply('you failed to run away')
      return int.channel.send(`<@${user.combat_target_id}>, it is your turn`)
    }
    user.combat = Boolean(false)
    user.combat_exp -= Number(1)
    tUser.combat = Boolean(false)
    tUser.combat_exp += Number(1)
    user.save()
    tUser.save()

    func.log(`ran away from ${user.combat_target_id}`, int, c);
    return int.channel.send(`${int.user.tag} ran away from ${user.combat_target}`);
  },
}