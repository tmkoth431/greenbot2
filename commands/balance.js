const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Shows a Players' Balance.")
    .addUserOption(options =>
      options.setName('user')
        .setDescription('Targeted User')
        .setRequired(false)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const target = int.options.getUser('user') ?? int.user;
    const user = app.currency.get(target.id)
    const bal = user.balance || '???'
    func.log(`checked ${target} balance of ${bal}`, int, c)
    return int.reply(`${target.tag} has \$${bal}.`);
  },
};