const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('copyidata')
    .setDescription('veiws full details on inventory')
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
    const items = await tuser.getItems();
    func.log(`checked ${tuser.user_id} inv`, int, c);
    return int.reply(`\n${items.sort((a, b) => a.id - b.id).map(i => `[${i.shop_id}] ${i.id}: ${i.item_id} ${i.type} ${i.enchant} ${i.damage} ${i.attribute} ${i.scale} ${i.heal} ${i.ecost} ${i.amount}`).join('\n')}`)
  },
}