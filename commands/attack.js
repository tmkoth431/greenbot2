const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('attack')
    .setDescription('attacks user you are in combat with'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')
    const { Op } = require('sequelize');

    const user = app.currency.get(int.user.id)
    if (!user.combat) return int.reply('you are not in combat')
    if (!user.turn) return int.reply('not your turn')
    const weapon = await UserItems.findOne({ where: { user_id: { [Op.like]: int.user.id }, equipped: true } })
    const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
    let scale = Number(0)
    if (weapon.attribute != 'none') {
      if (weapon.attribute === 'str') {
        scale = Math.round(user.strength * weapon.scale)
      } else if (weapon.attribute === 'dex') {
        scale = Math.round(user.dexterity * weapon.scale)
      }
    }
    let rand = Math.round(((Math.random() - 0.5) * 2) + (weapon.damage + scale))
    let crit = Boolean((Math.round(Math.random() * 100) + user.luck) > 99)
    if (crit) rand * 2

    //non-player combat
    if (user.combat_target_id == '0') {
      const enemy = await Enemy.findOne({ where: { user_id: int.user.id } })
      enemy.health -= Number(rand)
      enemy.save()
      func.log(`attacked enemy:${enemy.name}`, int, c);
      if (!crit) { int.reply(`${int.user.tag} hit ${enemy.name} for ${rand}`); }
      else { int.reply(`${int.user.tag} CRIT ${enemy.name} for ${rand}`) }
      if (enemy.health < 1) {
        user.combat = Boolean(false)
        user.combat_exp += Number(1)
        user.save()
        func.log(`killed enemy:${enemy.name}`, int, c)
        int.reply(`${int.user.tag} killed the ${enemy.name}`)
        return await Enemy.destroy({ where: { user_id: int.user.id } })
      }
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
    const tUserEffects = await UserEffects.findOne({ where: { user_id: user.combat_target_id } })

    user.turn = Boolean(false)
    tUser.turn = Boolean(true)
    tUser.health -= Number(rand)
    user.save()
    tUser.save()
    if (weapon.enchant != null) {
      let ench = app.getEnchants()
      ench = ench.get(weapon.enchant)
      await ench.execute(int, null, tUserEffects, user, tUser)
    }

    func.log(`attacked ${user.combat_target_id}`, int, c);
    if (!crit) { int.reply(`${int.user.tag} attacked ${user.combat_target} for ${rand}`); }
    else { int.reply(`${int.user.tag} CRIT ${user.combat_target} for ${rand}`) }
    if (tUser.health < 1) {
      user.combat = Boolean(false)
      tUser.combat = Boolean(false)
      user.combat_exp += Number(tUser.combat_exp)
      tUser.health = Number(0)
      user.save()
      tUser.save()
      func.clearStatus(tUserEffects)
      func.log(`killed ${user.combat_target_id}`, int, c)
      func.die(int, `was killed by <@${int.user.id}>`, tUser, tUserEffects, c)
    }
    return int.channel.send(`<@${user.combat_target_id}>, it is your turn`)
  },
}