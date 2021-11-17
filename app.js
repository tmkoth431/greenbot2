const { Client, Collection, Intents } = require('discord.js')
const config = require('./config.json')
const fs = require('fs');
const { Users, Shop } = require('./dbObjects.js');
const func = require('./resources/functions')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const adminFiles = fs.readdirSync('./admincmd').filter(file => file.endsWith('.js'));

const currency = new Collection();
const cooldowns = new Collection();

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

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  currency.add(message.author.id, 1);
});

client.on('interactionCreate', async int => {
  if (!int.isCommand()) return;
  let user = currency.get(int.user.id)
  const now = Date.now();
  if (!user) {
    user = await Users.create({ user_id: int.user.id });
    currency.set(int.user.id, user);
    if (config.author.includes(int.user.id)) {
      user.balance += Number(100)
      user.save()
    }
    func.logconsole(`initialized user <${int.user.id}>`, int.createdAt, client)
  }

  const command = client.commands.get(int.commandName);

  if (!command) return;

  //cooldowns
  if (!cooldowns.has(command.commandName)) {
    cooldowns.set(command.commandName, new Collection());
  }
  const timestamps = cooldowns.get(command.commandName);
  const cooldownAmount = (command.cooldown || 1) * 1000;
    // && !config.tester.includes(int.user.id)
  if (timestamps.has(int.user.id)) {
    const expirationTime = timestamps.get(int.user.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return int.reply({ content: `ahhhhh! too fast, slow it down for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${int.commandName}\` command.`, ephemeral: true });
    }
  }

  try {
    timestamps.set(int.user.id, now);
    setTimeout(() => timestamps.delete(int.user.id), cooldownAmount);
    await command.execute(int, client);
  } catch (error) {
    console.error(error);
    await int.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
  

});

client.once('ready', async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));
  console.log('Ready!')
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

module.exports = { getCommands, currency }
client.login(config.token)