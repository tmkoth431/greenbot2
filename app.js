const startTime = Date.now();
const { Client, Collection, Intents } = require('discord.js')
const config = require('./config.json')
const fs = require('fs');
const { Users, Shop, UserEffects } = require('./dbObjects.js');
const func = require('./resources/functions')
const { MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
client.commands = new Collection();
client.enchants = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const adminFiles = fs.readdirSync('./admincmd').filter(file => file.endsWith('.js'));

const currency = new Collection();
const cooldowns = new Collection();

const allowed = [];
for (var i = 0; i < config.author.length; i++) {
  allowed.push(config.author[i]);
}
const admincommands = [];
for (var i = 0; i < config.admincommands.length; i++) {
  admincommands.push(config.admincommands[i]);
}

const embededd = new MessageEmbed()
      .setTitle(`Error`)
      .setColor('#25c059')

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}
for (const file of adminFiles) {
  const command = require(`./admincmd/${file}`);
  client.commands.set(command.data.name, command);
}

function getCommands() {
  return client.commands
}
function getEnchants() {
  return client.enchants
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  currency.add(message.author.id, 1);
});

client.on('interactionCreate', async int => {
  if (!int.isCommand()) return;
  let user = currency.get(int.user.id)
  let userEffects = await UserEffects.findOne({ where: { user_id: int.user.id } })
  const now = Date.now();

  if (!user) {
    user = await Users.create({ user_id: int.user.id });
    userEffects = await UserEffects.create({ user_id: int.user.id })
    currency.set(int.user.id, user);
    if (config.author.includes(int.user.id)) {
      user.addUniqueItem('god\_sword', 'w', null, 100, 'str', 1, null, null, 1)
      user.addUniqueItem('wacking\_stick', 'w', 'mystery', 0, 'none', 0, null, null, 1)
      user.balance += Number(100)
      user.save()
    }
    func.logconsole(`initialized user ${int.user.id}`, new Date(Date.now()), client)
  }
  // if (user.curse) {
  //   const curseTime = 60000;
  //   const expirationTime = Number(user.curse_time) + curseTime;
  //   if (now > expirationTime) {
  //     try {
  //       await int.delete()
  //       user.curse_time = Date.now();
  //       user.save()
  //     } catch (e) {
  //       console.log('could not delete message')
  //     }
  //   }
  // }
  const cause = func.updateEffects(int, user, userEffects)
  if (user.health < 1) {
    func.die(int, cause, user, userEffects, client)
  }

  if (admincommands.includes(int.commandName) && !allowed.includes(int.user.id)) {
    func.log('attempted to use an unauthorized command', int, client);
    embededd.setDescription('You do not have access to this command!').setThumbnail('https://i.imgur.com/tDWLV66.png');
    return int.reply({ embeds: [embededd], ephemeral: true });
  }

  func.levelup(int, user, client)
  const command = client.commands.get(int.commandName);

  if (!command) return;

  //cooldowns
  if (!cooldowns.has(command.commandName)) {
    cooldowns.set(command.commandName, new Collection());
  }
  const timestamps = cooldowns.get(command.commandName);
  const cooldownAmount = (command.cooldown || 1) * 1000;
  if (timestamps.has(int.user.id) && (!config.tester.includes(int.user.id) && !config.author.includes(int.user.id))) {
    const expirationTime = timestamps.get(int.user.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return int.reply({ content: `Too fast. Wait for ${timeLeft.toFixed(1)} more second${timeLeft.toFixed(1) > 1 ? 's' : ''} before reusing the \`${int.commandName}\` command.`, ephemeral: true });
    }
  }

  try {
    timestamps.set(int.user.id, now);
    setTimeout(() => timestamps.delete(int.user.id), cooldownAmount);
    await command.execute(int, client);
  } catch (error) {
    func.error(error, new Date(Date.now()), client);
    await int.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
  func.levelup(int, user, client)
  

});

client.once('ready', async () => {
  console.log(`${client.ws.ping}ms ${new Date(Date.now())}: <console> - Logging in as ${client.user.tag}...`)
  const enchantFiles = fs.readdirSync('./resources/enchants').filter(file => file.endsWith('.js'));
  for (const file of enchantFiles) {
    const ench = require(`./resources/enchants/${file}`);
    client.enchants.set(ench.name, ench);
  }
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  console.log(`${client.ws.ping}ms ${new Date(Date.now())}: <console> - Logged in as ${client.user.tag} in ${(Date.now() - startTime) / 1000} seconds!`)
  const embededd = new MessageEmbed()
    .setTitle('Update')
    .setColor('#25c059')
    .setDescription('The bot is online!');
  client.channels.cache.get(config.updates_channel).send({ disableEveryone: false, content: '@everyone', embeds: [embededd] });
})
Reflect.defineProperty(currency, 'add', {
  value: async function add(id, amount) {
    const user = currency.get(id);

    if (user) {
      user.balance += Number(amount);
      return user.save();
    }

    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);

    return newUser;
  },
});

Reflect.defineProperty(currency, 'getBalance', {
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

module.exports = { getCommands, getEnchants, currency }
client.login(config.token)