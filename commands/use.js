const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('use')
    .setDescription('uses an item')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('item id')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Shop, Enemy } = require('../dbObjects')
    const { Op } = require('sequelize');

    const user = app.currency.get(int.user.id)
    const itemName = int.options.getString('item_id')
    let item = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: itemName } } });
    if (!item) {
      item = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: itemName } });
      if (!item) return int.reply(`unnable to find item ${itemName}`)
    }
    const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
    if (item.amount < 0) return int.reply(`you do not own any ${item.item_id}s`)
    if (user.combat) {
      if (!user.turn) return int.reply('not your turn in combat')

      if (user.combat_target_id == '0') {
        const enemy = Enemy.findOne({ where: { user_id: int.user.id } })
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
    }
    if (item.type == 'c') {
      const heal = item.heal
      if (item.enchant != null) {
        let ench = app.getEnchants()
        ench = ench.get(item.enchant)
        await ench.execute(int, userEffects, null, user, null)
      }

      user.health = Number(Math.min(user.max_health, user.health + heal))
      await user.addItem(item.item_id, item.id, -1)

      func.log(`used a ${item.item_id}`, int, c);
      return int.reply(`${int.user.tag} healed for ${heal}`);
    } else if (item.type == 'e') {
      const equipped = await UserItems.findOne({ where: { user_id: { [Op.like]: int.user.id }, equipped: true } })
      if (!equipped) return int.reply('must have a weapon equipped to enchant')
      if (user.level_points < item.ecost) return int.reply('you dont have enough level points')
      equipped.amount -= Number(1)
      equipped.equipped = Boolean(false)
      equipped.save()

      const is_item = await UserItems.findOne({ where: { user_id: int.user.id, item_id: `${equipped.item_id}\_of\_${item.enchant}`, type: equipped.type, enchant: item.enchant, damage: equipped.damage, attribute: equipped.attribute, scale: equipped.scale, equipped: true } })
      if (!is_item) await user.addUniqueItem(`${equipped.item_id}\_of\_${item.enchant}`, equipped.type, item.enchant, equipped.damage, equipped.attribute, equipped.scale, null, null, 1)
      else await user.addItem(is_item.item_id, is_item.id, 1)

      await user.addItem(item.item_id, item.id, -1)
      user.level_points -= Number(item.ecost)
      user.save()

      is_item.equipped = Boolean(true)
      is_item.save()

      func.log(`enchanted ${equipped.item_id} with ${item.enchant}`, message, client);
      return int.reply(`${int.user.tag} healed for ${heal}`);
    }
    return int.reply(`${itemName} is not a consumable`)
  },
}