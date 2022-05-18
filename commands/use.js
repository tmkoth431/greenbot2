const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('use')
    .setDescription('Uses an Item')
    .addStringOption(options =>
      options.setName('item_id')
        .setDescription('Item ID')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Shop, Enemy } = require('../dbObjects')
    const { Op } = require('sequelize');
    const embededd = new MessageEmbed()
      .setTitle(`Use`)
      .setColor('#25c059')

    const user = app.currency.get(int.user.id)
    const itemName = int.options.getString('item_id')
    let item = await UserItems.findOne({ where: { user_id: int.user.id, item_id: { [Op.like]: itemName } } });
    if (!item) {
      item = await UserItems.findOne({ where: { user_id: int.user.id, shop_id: itemName } });
      if (!item) {
        embededd.setDescription(`That item is not in your inventory!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
    }
    const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
    if (item.amount < 0) {
      embededd.setDescription(`You do not own any ${item.item_id}s`).setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
    if (user.combat) {
      if (!user.turn) {
        embededd.setDescription(`It is not your turn in combat!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
      if (user.combat_target_id == '0') {
        const enemy = Enemy.findOne({ where: { user_id: int.user.id } })
        const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
        let erand = Math.round(((Math.random() - 0.5) * 2) + (enemy.damage))
        let ecrit = Boolean((Math.round(Math.random() * 100) + 5) > 99)
        if (ecrit) erand * 2
        user.health -= Number(erand)
        user.save()
        if (!ecrit) { 
          embededd.setDescription(`${int.user.tag} was hit by ${enemy.name} for ${erand}!`)
          int.reply({ embeds: [embededd] }); 
        } else { 
          embededd.setDescription(`${int.user.tag} was hit by ${enemy.name} for ${erand}! Critical hit!`)
          int.reply({ embeds: [embededd] }) 
        }
        if (user.health < 1) {
          user.combat = Boolean(false)
          user.save()
          func.die(int, `was defeated by the ${enemy.name}!`, user, userEffects, c)
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
        await ench.execute(int, userEffects, user)
      }

      user.health = Number(Math.min(user.max_health, user.health + heal))
      await user.addItem(item.item_id, item.id, -1)
      if (item.heal != 0) {
        func.log(`used a${func.startsWithVowel(item.item_id) ? 'n' : ''} ${item.item_id}`, int, c);
        embededd.setDescription(`<@${int.user.id}> healed ${heal} health!`);
      } else {
        func.log(`used a${func.startsWithVowel(item.item_id) ? 'n' : ''} ${item.item_id}`, int, c);
        embededd.setDescription(`<@${int.user.id}> improved their ${item.enchant} ability!`);
      }
      return int.reply({ embeds: [embededd] });
    } else if (item.type == 'e') {
      const equipped = await UserItems.findOne({ where: { user_id: { [Op.like]: int.user.id }, equipped: true } })
      if (!equipped) {
        func.log(`attempted to enchant without an equipped weapon`, int, c);
        embededd.setDescription(`You must have a weapon equipped to enchant!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
      if (user.level_points < item.ecost) {
        func.log(`attempted to enchant when they couldn't afford it`, int, c);
        embededd.setDescription(`You do not have enough XP points!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
        return int.reply({ embeds: [embededd] })
      }
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

      func.log(`${int.user.id} Enchanted ${equipped.item_id} with ${item.enchant}.`, message, client);
      if (!item.ench && item.heal <= 0) {
        embededd.setDescription(`<@${int.user.id}> improved their ${item.ench} ability!`)
        return int.reply({ embeds: [embededd] })
      }
      embededd.setDescription(`<@${int.user.id}> healed for ${heal} and improved their ${item.ench} ability!.`)
      return int.reply({ embeds: [embededd] });
    } else {
      embededd.setDescription(`${item.item_id} is not consumable!`).setThumbnail('https://i.imgur.com/tDWLV66.png')
      return int.reply({ embeds: [embededd] })
    }
  },
}