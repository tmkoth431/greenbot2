const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    func.log(`says hello`, int, c)
    await int.reply('hello')
  },
}