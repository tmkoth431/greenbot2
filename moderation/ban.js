const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('The user you want to ban')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
      .setDescription('The reason to ban that user')
      .setRequired(false)),
  async execute(int, client) {
    const embededd = new MessageEmbed()
      .setTitle('Ban')
      .setColor('#25c059');
  
    const func = require('../resources/functions');
    const user = int.options.getUser('user');
    const reason = int.options.getString('reason') || 'No reason provided';

    if (!int.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      embededd.setDescription('You do not have permission to use this command!').setThumbnail('https://i.imgur.com/tDWLV66.png');
      await int.reply({ embeds: [ embededd ]});
      return await func.modLog(int, `tried to use /ban when they didn't have permission!`, client);
    }
    
    if (int.member.roles.highest > int.guild.members.cache.get(user.id).roles.highest || user == client.user) {
      embededd.setDescription('You cannot ban this person!').setThumbnail('https://i.imgur.com/tDWLV66.png');
      await int.reply({ embeds: [ embededd ]});
      return await func.modLog(int, `tried to /ban someone higher than themselves!`, client);
    }
  
    int.guild.members.ban(user.id, { reason: `${reason}` }).catch(async error=> {
      if (error.code == 50013) {
        embededd.setDescription('The bot is unable to ban this person. This is usually because the person you tried to ban is the server owner.').setThumbnail('https://i.imgur.com/tDWLV66.png')
        await int.reply({ embeds: [ embededd ] });
        return await func.modLog(int, `tried to ban ${int.guild.name}'s owner, <@${await int.guild.fetchOwner().id}>!`, client)
      }
      await func.error(error, int, client);
    });

    embededd.setDescription(`Successfully banned <@${user.id}> for ${reason}!`);
    await int.reply({ embeds: [ embededd ] });
    return await func.modLog(int, `banned <@${user.id}> for ${reason}!`, client);
  },
};
