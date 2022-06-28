const startTime = Date.now();
let admin = process.argv.includes('--admin');
let cmd = process.argv.includes('--commands') || process.argv.includes('--cmd') || process.argv.includes('-c');
let all = process.argv.includes('--all') || process.argv.includes('-a');
if (cmd && admin) {
  all = true;
}
if (all) {
  admin = true;
  cmd = true;
}
if (!all && !cmd && !all) {
  all = true;
}
console.log(`${new Date(startTime)}: <console> - Refreshing all application (/) commands...`);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');
const fs = require('fs');

const commands = [];
const admincmds = [];
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
const adminFiles = fs.readdirSync('../admincmd').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.push(command.data.toJSON());
}
for (const file of adminFiles) {
  const command = require(`../admincmd/${file}`);
  admincmds.push(command.data.toJSON());
}

const rest = new REST({ }).setToken(config.token);

(async () => {
  try {

    if (cmd) {
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands },
      );
    }
    if (admin) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: admincmds },
      );
    }
    console.log(`${new Date(Date.now())}: <console> - Refreshed ${all ? 'all' : (cmd ? 'command' : 'admin')} application (/) commands in ${(Date.now() - startTime) / 1000} seconds.`)
  } catch (error) {
    console.error(error);
  }
})();