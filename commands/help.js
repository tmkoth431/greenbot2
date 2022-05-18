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
      .setDescription(`${app.getCommands().map(cmd => `/${cmd.data.name} - ${cmd.data.name == 'help' ? 'Shows this screen' : cmd.data.description}.`).join('\n').replaceAll('undefined', 'No description set')}`)
      // .setImage('https://i.imgur.com/lB3Hqi7.png');

    func.log(`got help`, int, c);
    await int.reply({ embeds: [embededd] });
  },
}