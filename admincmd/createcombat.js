const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcombat')
    .setDescription('starts combat for testing')
    .addStringOption(options =>
      options.setName('user_id')
        .setDescription('target user id')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('name')
        .setDescription('name of enemy')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('max_health')
        .setDescription('max health')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('health')
        .setDescription('health')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('enchant')
        .setDescription('enchant')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('damage')
        .setDescription('damage')
        .setRequired(true))
    .addStringOption(options =>
      options.setName('reward')
        .setDescription('reward')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Enemy } = require('../dbobjects')

    const id = int.options.getString('user_id')
    const name = int.options.getString('name')
    const max = int.options.getString('max')
    const hp = int.options.getString('hp')
    const enchant = int.options.getString('enchant')
    const damage = int.options.getString('damage')
    const reward = int.options.getString('reward')
    func.log(`says hello`, int, c)
    await int.reply('hello')
  },
}