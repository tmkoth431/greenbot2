const startTime = Date.now();
console.log(`${new Date(startTime)}: <console> - Refreshing admin application (/) commands...`);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');

const admincmds = [];
const adminFiles = fs.readdirSync('./admincmd').filter(file => file.endsWith('.js'));

for (const file of adminFiles) {
  const command = require(`./admincmd/${file}`);
  admincmds.push(command.data.toJSON());
}

const rest = new REST({ }).setToken(config.token);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: admincmds },
    );
    console.log(`${new Date(Date.now())}: <console> - Refreshed admin application (/) commands in ${(Date.now() - startTime) / 1000} seconds.`)
  } catch (error) {
    console.error(error);
  }
})();