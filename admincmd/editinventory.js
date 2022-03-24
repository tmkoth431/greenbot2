const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  defaultPermission: false,
  data: new SlashCommandBuilder()
  .setName('editinv')
  .setDescription('edits a players inventory')
  .addStringOption(options =>
    options.setName('user_id')
    .setDescription('the user id')
    .setRequired(true))
  .addStringOption(options =>
    options.setName('item_id')
    .setDescription('the item to use')
    .setRequired(true))
  .addStringOption(options =>
    options.setName('num')
    .setDescription('the number of items')
    .setRequired(true))
  .addBooleanOption(options =>
    options.setName('add')
    .setDescription('add?')
    .setRequired(true)),
  async execute(int, c) {
    const app = require('../app')
    const func = require('../resources/functions')
    const { Shop } = require('../dbobjects')

    const args = [
      int.options.getString('user_id'),
      int.options.getString('item_id'),
      int.options.getString('num'),
      int.options.getBoolean('add')
    ]

    const user = app.currency.get(args[0])
    if (!user) {
      func.log(`attempted to edit the inventory of an unrecognized player`, int, c)
      return int.reply(`Couldn\'t find the user ${args[0]}!`)
    }

    let item = await Shop.findOne({ where: { id: args[1] } });
    const itemName = item.name
    if (!item) {
      func.log(`attempted to add an unrecognized item to ${args[0]}'s inventory`, int, c)
      return int.reply(`${args[1]} is not an item`)
    }
    if (Boolean(args[3])) {
      await user.addItem(item.name, item.id, Number(args[2]))
      user.save()
      func.log(`added ${args[2]} ${itemName} to ${args[0]}`, int, c)
      return int.reply(`added ${args[2]} ${itemName} to <@${args[0]}>`)
    } else {
      if (item.amount < Number(args[2])) return int.reply(`<@${args[0]}> does not have that many items!`)
      await user.addItem(item.name, item.id, -Number(args[2]))
      user.save()
      func.log(`removed ${args[2]} ${itemName} from ${args[0]}`, int, c)
      return int.reply(`removed ${args[2]} ${itemName} from <@${args[0]}>`)
    }
  },
}