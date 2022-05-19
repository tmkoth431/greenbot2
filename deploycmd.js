const startTime = Date.now();
console.log(`${new Date(startTime)}: <console> - Refreshing user application (/) commands...`);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ }).setToken(config.token);

(async () => {
  try {

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );
    console.log(`${new Date(Date.now())}: <console> - Refreshed user application (/) commands in ${(Date.now() - startTime) / 1000} seconds.`)
  } catch (error) {
    console.error(error);
  }
})();