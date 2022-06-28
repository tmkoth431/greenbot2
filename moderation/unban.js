const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a user')
    .addStringOption(option =>
      option.setName('user')
      .setDescription('The id of the user you want to unban')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
      .setDescription('The reason to unban that user')
      .setRequired(false)),
	async execute(int, client) {
    const embededd = new MessageEmbed()
      .setTitle('Unban')
      .setColor('#25c059');

    const func = require('../resources/functions');
    const userid = int.options.getString('user');
    const reason = int.options.getString('reason') || 'No reason provided';
    const user = client.users.fetch(userid).catch(async error => {
      if (error.code == 50035) {
        embededd.setDescription(`${userid} is not a valid user!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
        await int.reply({ embeds: [ embededd ] });
        return await func.modLog(int, `tried to unban an invalid user!`, client);
      }
      await func.error(error, int, client);
    });
    
    if (!int.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      embededd.setDescription('You do not have permission to use this command!').setThumbnail('https://i.imgur.com/tDWLV66.png');
      await int.reply({ embeds: [ embededd ]});
      return await func.modLog(int, `tried to use /kick when they didn't have permission!`, client);
    }

    const banList = await int.guild.bans.fetch();

    const bannedUser = banList.find(user => user.id === user.id);

    if (!bannedUser) {
      embededd.setDescription(`<@${userid}> is not banned!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
      await int.reply({ embeds: [ embededd ] });
      return await func.modLog(int, `tried to unban a user that was not banned!`, client);
    }

    int.guild.members.unban(userid).catch(async error => {
      if (error.code == 50035) {
        embededd.setDescription(`<@${userid}> is not a valid user!`).setThumbnail('https://i.imgur.com/tDWLV66.png');
        await int.reply({ embeds: [ embededd ] });
        return await func.modLog(int, `tried to unban an invalid user!`, client);
      }
      
      console.error(error);
    });


    embededd.setDescription(`Successfully unbanned <@${userid}> for ${reason}!`);
    await int.reply({ embeds: [ embededd ] });
    return await func.modLog(int, `unbanned <@${userid}> for ${reason}!`, client);
    
	},
};
