const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetinventory')
    .setDescription('resets inventory')
    .addStringOption(options =>
      options.setName('user')
        .setDescription('target user id')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { UserItems } = require('../dbobjects')

    const target = int.options.getString('user')
    const tuser = app.currency.get(target)
    UserItems.destroy({ where: { user_id: tuser.user_id } })
    func.log(`reset ${tuser.user_id}\'s inventory`, int, c);
    return int.reply(`reset <@${target}>'s inventory`)
  },
}