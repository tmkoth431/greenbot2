const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Change server settings.')
    .addSubcommandGroup(subcommand =>
      subcommand.setName('logging')
      .setDescription('Sets the logging channel for warnings')
      .addSubcommand(subcommand =>
        subcommand.setName('set')
        .setDescription('Set the logging channel')
        .addChannelOption(option =>
          option.setName('logging_channel')
          .setDescription('Sets the logging channel for warnings')
          .setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName('view')
        .setDescription('View the logging channel for warnings')))
    .addSubcommandGroup(subcommand =>
      subcommand.setName('badwords')
      .setDescription('Configure badwords')
      .addSubcommand(subcommand =>
        subcommand.setName('add')
        .setDescription('Add a badword to the badwords list')
        .addStringOption(option =>
          option.setName('badword')
          .setDescription('The badword to add')
          .setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName('remove')
        .setDescription('Remove a badword from the badwords list')
        .addStringOption(option =>
          option.setName('badword')
          .setDescription('The badword to remove')
          .setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand.setName('clear')
        .setDescription('Clear the badwords list'))
      .addSubcommand(subcommand =>
        subcommand.setName('view')
        .setDescription('View the list of badwords'))
      .addSubcommand(command =>
        command.setName("viewenabled")
        .setDescription("View whether badwords are enabled"))
      .addSubcommand(command =>
        command.setName("setenabled")
        .setDescription("Change whether badwords are enabled")
        .addBooleanOption(option =>
          option.setName("enabled")
          .setDescription("Whether to enable badwords")
          .setRequired(true))))
    .addSubcommandGroup(group =>
      group.setName("punishments")
      .setDescription("Manage punishments for warnings")
      .addSubcommand(subcommand =>
        subcommand.setName("edit")
        .setDescription("Edit punishments for the server")
        .addIntegerOption(option =>
          option.setName("warnings")
          .setDescription("The number of warnings for the punishment to change")
          .addChoices([
            ["1", 1],
            ["2", 2],
            ["3", 3],
            ["4", 4],
            ["5", 5],
            ["10", 10],
          ])
          .setRequired(true))
        .addIntegerOption(option =>
          option.setName("punishment")
          .setDescription("The new punishment")
          .setRequired(true)
          .addChoices([
            ["None", 0],
            ["Five minute timeout", 5],
            ["One hour timeout", 7],
            ["One day timeout", 1],
            ["Kick from server", 2],
            ["One day ban", 6],
            ["One week ban", 3],
            ["Perma-ban", 4],
          ])))
      .addSubcommand(option =>
        option.setName("view")
        .setDescription("View punishments"))
      .addSubcommand(command =>
        command.setName("viewenabled")
        .setDescription("View whether punishments are enabled"))
      .addSubcommand(command =>
        command.setName("setenabled")
        .setDescription("Change whether punishments are enabled")
        .addBooleanOption(option =>
          option.setName("enabled")
          .setDescription("Whether to enable punishments")
          .setRequired(true)))),
  async execute(int, client) {
    const func = require('../resources/functions.js');
    const embededd = new MessageEmbed()
      .setTitle(`config:${int.options.getSubcommandGroup()}:${int.options.getSubcommand()}`)
      .setColor('#25c059')

    if (!int.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      embededd.setDescription("You do not have permission to use this command!").setThumbnail('https://i.imgur.com/tDWLV66.png');
      await int.reply({ embeds: [ embededd ] });
      return await func.modLog(int, `tried to use /config when they didn't have permission!`, client);
    }

    switch (int.options.getSubcommandGroup()) {
      case 'logging':
        switch (int.options.getSubcommand()) {
          case 'set':
            const channel = await int.options.getChannel('logging_channel');
            if (channel.type != 'GUILD_TEXT') {
              embededd.setDescription("You must choose a text channel for logs!").setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] });
              return await func.modLog(int, `tried to set the logging channel to a non-text channel!`, client);
            }
            if (channel.id == await func.getLoggingChannel(int.guild.id)) {
              embededd.setDescription(`<#${channel.id}> is already the logging channel!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] });
              return await func.modLog(int, `tried to set the logging channel to what it already was!`, client);
            }
            await func.setLoggingChannel(int.guild.id, channel.id);
            embededd.setDescription(`Successfully set the logging channel to <#${channel.id}>`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `set the logging channel to <#${channel.id}>!`, client);
          case 'view':
            const channel2 = await func.getLoggingChannel(int.guild.id);
            if (channel2 == -1) {
              embededd.setDescription(`You have not set up a logging channel!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] });
              return await func.modLog(int, `tried to view the logging channel when none were set up!`, client);
            }
            embededd.setDescription(`The logging channel for ${int.guild.name} is <#${channel2}>`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `viewed the logging channel!`, client);
        }
      case 'badwords':
        switch (int.options.getSubcommand()) {
          case 'add':
            let badword2 = int.options.getString('badword');
            let badwords2 = await func.getBadwords(int.guild.id);
            for (x in badwords2) {
              badwords2[x] = badwords2[x].badword;
              if (badword2 == badwords2[x]) {
                embededd.setDescription(`${badword2} is already a badword!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
                await int.reply({ embeds: [ embededd ] });
                return await func.modLog(int, `tried to add a badword that already existed!`, client);
              }
            }
            await func.addBadword(int.guild.id, badword2).catch(console.error());
            embededd.setDescription(`Successfully added "||${badword2}||" as a badword!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `added "||${badword2}||" as a badword!`, client);
          case 'remove':
            let badword = int.options.getString('badword').toLowerCase();
            const stuf = await func.removeBadword(int.guild.id, badword);
            if (stuf == 0) {
              embededd.setDescription(`"||${badword}||" is not a badword!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] })
              return await func.modLog(int, `tried to remove a badword that wasn't on the list!`, client);
            }
            embededd.setDescription(`Successfully removed "||${badword}||" as a badword!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `removed "||${badword}||" as a badword!`, client);
          case 'view':
            let badwords = await func.getBadwords(int.guild.id);
            for (x in badwords) {
              badwords[x] = `"||${badwords[x].badword}||"`;
            }
            if (badwords.length === 0) {
              embededd.setDescription(`You have no badwords registered for ${int.guild.name}!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] });
            } else {
              badwords = badwords.join("\n");
              embededd.setDescription(`Badwords for ${int.guild.name} are:\n\n${badwords}`);
              await int.reply({ embeds: [ embededd ] });
            }
            return await func.modLog(int, `viewed badwords for this server!`, client);
          case 'clear':
            await func.clearBadwords(int.guild.id);
            embededd.setDescription('Successfully cleared all badwords!');
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `cleared badwords for this server!`, client);
          case 'viewenabled':
            const enabled = await func.getBadwordsEnabled(int.guild.id);
            embededd.setDescription(`Badwords are currently ${enabled ? `` : `not `}enabled!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `viewed if badwords were enabled!`, client);
          case 'setenabled':
            const enabled2 = await int.options.getBoolean("enabled");
            await func.setBadwordsEnabled(int.guild.id, enabled2);
            embededd.setDescription(`Successfully ${enabled2 ? 'dis' : 'en'}abled badwords!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `${enabled2 ? 'enabled' : 'disabled'} badwords!`, client);
        }
      case 'punishments':
        switch (int.options.getSubcommand()) {
          case 'edit':
            const warnings = int.options.getInteger('warnings');
            let punishment = int.options.getInteger('punishment');

            await func.setPunishment(int.guild.id, warnings, punishment);
            switch (punishment) {
              case null:
              case 0:
                punishment = 'none';
                break;
              case 1:
                punishment = 'one day timeout';
                break;
              case 2:
                punishment = 'server kick';
                break;
              case 3:
                punishment = 'one week ban';
                break;
              case 4:
                punishment = 'perma-ban';
                break;
              case 5:
                punishment = 'five minute timeout';
                break;
              case 6:
                punishment = 'one day ban';
                break;
              case 7:
                punishment = 'one hour timeout';
            }
            embededd.setDescription("Successfully changed punishment setting!");
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `set the punishment for ${warnings} warnings to ${punishment}!`, client);
          case 'view':
            const punishments = await func.getAllPunishments(int.guild.id);
            const allNone = punishments => punishments.every( v => v === 0 || null)
            if (punishments == -1 || allNone) {
              embededd.setDescription("You have not set up any punishments yet!").setThumbnail('https://i.imgur.com/tDWLV66.png');
              await int.reply({ embeds: [ embededd ] });
              return await func.modLog(int, `tried to view punishments when none were set up!`, client);
            }
            for (const x in punishments) {
              switch (punishments[x]) {
                case null:
                case 0:
                  punishments[x] = 'none';
                  break;
                case 1:
                  punishments[x] = 'one day timeout';
                  break;
                case 2:
                  punishments[x] = 'server kick';
                  break;
                case 3:
                  punishments[x] = 'one week ban';
                  break;
                case 4:
                  punishments[x] = 'perma-ban';
                  break;
                case 5:
                  punishments[x] = 'five minute timeout';
                  break;
                case 6:
                  punishments[x] = 'one day ban';
                  break;
                case 7:
                  punishments[x] = 'one hour timeout';
              }
            }
            embededd.setDescription(`Punishments for ${int.guild.name} are:\n
            One warn: ${punishments[0]}
            Two warns: ${punishments[1]}
            Three warns: ${punishments[2]}
            Four warns: ${punishments[3]}
            Five warns: ${punishments[4]}
            Ten warns: ${punishments[5]}`)
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `viewed punishments for this server!`, client);
          case 'viewenabled':
            const enabled = await func.getPunishmentsEnabled(int.guild.id);
            embededd.setDescription(`Punishments are currently ${enabled ? `` : `not `}enabled!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `viewed if punishments were enabled!`, client);
          case 'setenabled':
            const enabled2 = await int.options.getBoolean("enabled");
            await func.setPunishmentsEnabled(int.guild.id, enabled2);
            embededd.setDescription(`Successfully ${enabled2 ? 'en' : 'dis'}abled punishments!`);
            await int.reply({ embeds: [ embededd ] });
            return await func.modLog(int, `${enabled2 ? 'enabled' : 'disabled'} punishments!`, client);
        }
    }
  }
}