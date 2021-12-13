const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');

const commands = [];
const admincmds = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const adminFiles = fs.readdirSync('./admincmd').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
for (const file of adminFiles) {
  const command = require(`./admincmd/${file}`);
  admincmds.push(command.data.toJSON());
}

const rest = new REST({ }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: admincmds },
    );
    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error);
  }
})();