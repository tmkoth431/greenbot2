const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventorydata')
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
      func.log(`attempted to view the inventory of an unrecognized player`, int, c);
      return int.reply(`user <@${id}> is not initialized!`);
    }
    const items = await tuser.getItems();
    func.log(`used got the inventory data of ${tuser.user_id}`, int, c);
    return int.reply(`\n${items.sort((a, b) => a.id - b.id).map(i => `[${i.shop_id}] ${i.id}: ${i.item_id} ${i.type} ${i.enchant} ${i.damage} ${i.attribute} ${i.scale} ${i.heal} ${i.ecost} ${i.amount}`).join('\n')}`)
  },
}