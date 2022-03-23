const { SlashCommandBuilder, userMention } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
    .setName('totalstats')
    .setDescription('gets stats of every user'),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const tbal = await app.currency.map((user) => user.balance).reduce((prev, curr) => prev + curr, 0)
    const tdeath = await app.currency.map((user) => user.death_count).reduce((prev, curr) => prev + curr, 0)
    const tfishxp = await app.currency.map((user) => user.fish_exp).reduce((prev, curr) => prev + curr, 0)
    return int.reply('' + tbal)
  },
}