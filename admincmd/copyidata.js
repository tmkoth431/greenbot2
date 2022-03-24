const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('copyidata')
    .setDescription('views full details on inventory')
    // .setDefaultPermission(false)
    .addStringOption(option =>
      option.setName('id')
        .setDescription('target user id')
        .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')

    const id = int.options.getString('id')
    const tuser = app.currency.get(id)
    if (!tuser) {
      func.log(`got the inventory of ${tuser.user_id} when they were not initialized!`, int, c);
      return int.reply(`user <@${id}> is not initialized!`);
    }
    const items = await tuser.getItems();
    func.log(`used ${int.commandName} on ${tuser.user_id}`, int, c);
    return int.reply(`\n${items.sort((a, b) => a.id - b.id).map(i => `[${i.shop_id}] ${i.id}: ${i.item_id} ${i.type} ${i.enchant} ${i.damage} ${i.attribute} ${i.scale} ${i.heal} ${i.ecost} ${i.amount}`).join('\n')}`)
  },
}