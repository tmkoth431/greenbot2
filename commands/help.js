const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows the help screen'),
  async execute(int, c) {
    const app = require('../app');
    const func = require('../resources/functions');
    const embededd = new MessageEmbed()
      .setTitle('Help')
      .setColor('#25c059')
      .setDescription(`/attack - Attacks your combat opponent!
      /buy - Buys an item from the shop with its ID!
      /equip - Equip or unequip a weapon!
      /fish - Go fishing for some extra cash!
      /help - Shows this screen!
      /inventory - Shows yours or another players' inventory!
      /iteminfo - Get extra info about an item!
      /level - Level up stats using XP level points!
      /run - Attempt to run from combat!
      /shop - Shows items available to buy!
      /stats - Shows yours or another players' stats!
      /steal - Attempt to steal from a civilian or another player!
      /use - Uses an item in your inventory!`);

    func.log(`got help`, int, c);
    await int.reply({ embeds: [embededd] });
  },
}