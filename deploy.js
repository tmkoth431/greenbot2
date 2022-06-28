const startTime = Date.now();
console.log(`${new Date(startTime)}: <console> - Refreshing all application (/) commands...`);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');

const commands = [];
const admincmds = [];
const modcmds = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const adminFiles = fs.readdirSync('./admincmd').filter(file => file.endsWith('.js'));
const modFiles = fs.readdirSync('./moderation').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
for (const file of adminFiles) {
  const command = require(`./admincmd/${file}`);
  admincmds.push(command.data.toJSON());
}
for (const file of modFiles) {
  const command = require(`./moderation/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ }).setToken(config.token);

(async () => {
  try {

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: admincmds },
    );
    console.log(`${new Date(Date.now())}: <console> - Refreshed all application (/) commands in ${(Date.now() - startTime) / 1000} seconds.`)
  } catch (error) {
    console.error(error);
  }
})();