const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('run')
    .setDescription('attempt to flee from combat'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems, UserEffects, Enemy } = require('../dbobjects')
    const embededd = new MessageEmbed()
      .setTitle(`Duel`)
      .setColor('#25c059')

    const user = app.currency.get(int.user.id)
    if (!user.combat) {
      embededd.setDescription('You are not in combat!').setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }
    if (!user.turn) {
      embededd.setDescription('It is not your turn!').setThumbnail('https://i.imgur.com/IRh7QZo.png')
      return int.reply({ embeds: [embededd] })
    }

    let rand = Math.random() * 4

    if (user.combat_target_id == '0') {
      const enemy = await Enemy.findOne({ where: { user_id: int.user.id } })
      const userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
      let erand = Math.round(((Math.random() - 0.5) * 2) + (enemy.damage))
      let ecrit = Boolean((Math.round(Math.random() * 100) + 5) > 99)
      if (ecrit) erand * 2
      user.health -= Number(erand)
      user.save()
      if (!ecrit) { 
        embededd.setDescription(`${int.user.tag} was hit by ${enemy.name} for ${erand}`)
        int.reply({ embeds: [embededd] }); 
      } else { 
        embededd.setDescription(`${int.user.tag} was critically hit by ${enemy.name} for ${erand}`)
        int.reply({ embeds: [embededd] }) 
      }
      if (user.health <= 0) {
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
      embededd.setDescription(`You failed to run away.\n\nIt is ${user.combat_target}'s turn`)
      return int.reply({ embeds: [embededd] })
    }
    user.combat = Boolean(false)
    user.combat_exp -= Number(1)
    tUser.combat = Boolean(false)
    tUser.combat_exp += Number(1)
    user.save()
    tUser.save()

    func.log(`ran away from ${user.combat_target_id}`, int, c);
    embededd.setDescription(`${int.user.tag} ran away from ${user.combat_target}`)
    return int.reply({ embeds: [embededd] });
  },
}