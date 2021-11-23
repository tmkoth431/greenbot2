const Sequelize = require('sequelize');
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

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
  const shop = [
    Shop.upsert({ name: 'Apple', cost: 15, type: 'c', heal: 1, desc: 'heals for 1 health (and tastes good)' }),
    Shop.upsert({ name: 'Water', cost: 10, type: 'c', heal: 1, enchant: 'water', desc: 'can be used to put out fire' }),
    Shop.upsert({ name: 'Bread', cost: 30, type: 'c', heal: 2, desc: 'heals for 2 health' }),
    Shop.upsert({ name: 'Antidote', cost: 50, type: 'c', heal: 1, enchant: 'antidote', desc: 'can be used to cure poisons' }),
    Shop.upsert({ name: 'Fishing Potion', cost: 100, type: 'c', heal: 0, enchant: 'fishing', desc: 'slightly improves your fishing skill' }),
    Shop.upsert({ name: 'XP Potion', cost: 125, type: 'c', heal: 1, enchant: 'exp', desc: 'glows with liquid experience (its even organic)' }),
    Shop.upsert({ name: `Mysterious Brew`, cost: 75, type: 'c', heal: 1, enchant: 'mystery', desc: 'could be bad could be good, try it and find out' }),
    Shop.upsert({ name: 'Stick', cost: 10, type: 'w', damage: 1, attribute: 'none', desc: 'the most basic weapon' }),
    Shop.upsert({ name: 'Wood Dagger', cost: 25, type: 'w', damage: 2, attribute: 'dex', scale: 10, desc: 'a weak but fast attacking weapon' }),
    Shop.upsert({ name: 'Wood Sword', cost: 30, type: 'w', damage: 3, attribute: 'str', scale: 10, desc: 'a weak weapon that works better with stronger people' }),
    Shop.upsert({ name: 'Iron Dagger', cost: 55, type: 'w', damage: 4, attribute: 'dex', scale: 10, desc: 'a fast attacking iron weapon' }),
    Shop.upsert({ name: 'Iron Greatsword', cost: 60, type: 'w', damage: 6, attribute: 'str', scale: 10, desc: 'harder to use but does lots more damage' }),
    Shop.upsert({ name: 'Poison Dust', cost: 200, type: 'e', enchant: 'poison', ecost: 3, desc: 'a strange dust that can be applied to a weapon at the cost of experience' }),
    Shop.upsert({ name: 'Fire Dust', cost: 200, type: 'e', enchant: 'flame', ecost: 3, desc: 'a strange dust that can be applied to a weapon at the cost of experience' }),

    QuestBoard.upsert({ name: 'goblins', desc: 'we need you to kill the goblin that has been killing our sheep', diff: 1, enemy: 'goblin', damage: 2 }),
    QuestBoard.upsert({ name: 'gigantic', desc: 'there is a terrifying giant living in those distant mountains, we need you to take care of it', diff: 100, enemy: 'giant', max_health: 100, damage: 12, reward: 10000 }),
  ];
  try {
    await Promise.all(shop);
    console.log('db synced');
    sequelize.close();
  } catch (e) {
    console.log(e)
  }
}).catch(console.error);