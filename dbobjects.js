const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const config = require('./config.json')

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const Shop = require('./models/Shop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
const UserEffects = require('./models/UserEffects')(sequelize, Sequelize.DataTypes)
const Adventures = require('./models/Adventure')(sequelize, Sequelize.DataTypes)
const PlayerShop = require('./models/PlayerShop')(sequelize, Sequelize.DataTypes)
const QuestBoard = require('./models/QuestBoard')(sequelize, Sequelize.DataTypes)
const Enemy = require('./models/Enemy')(sequelize, Sequelize.DataTypes)
const Guild = require('./models/Warnings.js')(sequelize, Sequelize.DataTypes);
const Badwords = require('./models/Badwords.js')(sequelize, Sequelize.DataTypes);
const GuildSettings = require('./models/GuildSettings.js')(sequelize, Sequelize.DataTypes);
const Punishments = require('./models/Punishments.js')(sequelize, Sequelize.DataTypes);
Badwords.removeAttribute('id');

UserItems.belongsTo(Shop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
  value: async function addItem(item, id, add) {
    const userItem = await UserItems.findOne({
      where: { user_id: this.user_id, item_id: item, id: id },
    });
    const shopItem = await Shop.findOne({
      where: { name: item },
    });
    if (userItem) {
      userItem.amount += Number(add);
      return userItem.save();
    }
    return await UserItems.create({ user_id: this.user_id, item_id: item, shop_id: shopItem.id, amount: add, type: shopItem.type, enchant: shopItem.enchant, damage: shopItem.damage, attribute: shopItem.attribute, scale: shopItem.scale, heal: shopItem.heal, ecost: shopItem.ecost });
  }
});

Reflect.defineProperty(Users.prototype, 'addUniqueItem', {
  value: async function addUniqueItem(item, type, enchant, damage, attribute, scale, heal, ecost, desc, amount) {
    const userItem = await UserItems.findOne({
      where: {
        user_id: this.user_id,
        item_id: item,
        type: type,
        enchant: enchant,
        damage: damage,
        attribute: attribute,
        scale: scale,
        heal: heal,
        ecost: ecost
      },
    });
    if (userItem) {
      userItem.amount += Number(amount)
      return userItem.save()
    }
    const shopItem = await Shop.create({ name: item, type: type, enchant: enchant, damage: damage, attribute: attribute, scale: scale, ecost: ecost, desc: desc, buyable: false })

    return UserItems.create({ user_id: this.user_id, item_id: item, shop_id: shopItem.id, amount: amount, type: type, enchant: enchant, damage: damage, attribute: attribute, scale: scale, heal: heal, ecost: ecost });
  }
})


Reflect.defineProperty(Users.prototype, 'getItems', {
  value: function getItems() {
    return UserItems.findAll({
      where: { user_id: this.user_id },
      include: ['item'],
    });
  },

});

Reflect.defineProperty(Users.prototype, 'equip', {
  value: async function equip(item) {
    const equip = await UserItems.findOne({
      where: { user_id: this.user_id, item_id: item },
      include: ['item'],
    });
    equip.equipped = Boolean(true);
    equip.amount -= Number(1)
    equip.save()
    return
  }
})

Reflect.defineProperty(Users.prototype, 'setBalance', {
  value: async function add(amount) {
    this.balance = amount
    return this.user.save()
  },
});

Reflect.defineProperty(Users.prototype, 'getBalance', {
  value: function getBalance() {
    return this.balance;
  },
});

module.exports = { Users, Shop, PlayerShop, UserItems, UserEffects, Adventures, QuestBoard, Enemy, Guild, Badwords, GuildSettings, Punishments };