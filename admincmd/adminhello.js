const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('adminhello')
    .setDescription('says hello'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    func.log(`says hello as an admin`, int, c)
    await int.reply('hello')
  },
}