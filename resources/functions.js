const fs = require('fs');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');

module.exports = {
  log: function (text, int, client) {
    var readarchives = fs.readFileSync('archives.txt', `utf-8`);
    var text2 = `${String(text)}`
    var author = `${int.user.id}`
    for (var i = 0; i < config.coolids.length; i++) {
      text2 = text2.replace('@', '')
      text2 = text2.replace('<', '')
      text2 = text2.replace('>', '')
      text2 = text2.replace(`${config.coolids[i]}`, `${config.coolnames[i]}`)
      if (text2.includes(config.coolids[i])) console.log('name change failed')
      author = author.replace(`${config.coolids[i]}`, `${config.coolnames[i]}`)
    }
    this.writetoarchive(`${client.ws.ping}ms ${new Date(Date.now())}: ${int.guild} - ${author} ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds\n`)
    client.channels.cache.get(config.log_channel).send(codeBlock(`${client.ws.ping}ms ${int.guild} - ${author} ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds`))
    return console.log(`${client.ws.ping}ms ${new Date(Date.now())}: ${int.guild} - ${author} ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds`);
  },
  logconsole: function (text, client) {
    var text2 = `${String(text)}`
    for (var x = 0; x < config.coolids.length; x++) {
      text2 = text2.replace(`${config.coolids[x]}`, `${config.coolnames[x]}`)
      if (text2.includes(config.coolids[x])) console.log('name change failed')
    }
    this.writetoarchive(`${client.ws.ping}ms ${new Date(Date.now())}: <console> - ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds\n`)
    client.channels.cache.get(config.log_channel).send(codeBlock(`${client.ws.ping}ms <console> - ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds`))
    return console.log(`${client.ws.ping}ms ${new Date(Date.now())}: <console> - ${text2} in ${(Date.now() - int.createdAt) / 1000} seconds`);
  },
  writetoarchive: function (text) {
    fs.appendFileSync(`logs/${require('../app').epicstartdate}/archives.txt`, text)
  },
  error: function (text, client) {
    fs.appendFileSync(`logs/${require('../app').epicstartdate}/error.txt`, `${client.ws.ping}ms ${new Date(Date.now())}: ${text}\n`)
  },
  clearStatus: function (userEffects) {
    userEffects.burn = Number(0)
    userEffects.poison = Number(0)
    return userEffects.save()
  },
  calclvl: function (lvl) {
    return Math.round(Math.pow((lvl + 1), 1.5))
  },
  levelup: function (int, user, client) {
    if (user.exp >= this.calclvl(user.level)) {
      user.exp -= this.calclvl(user.level)
      user.level += Number(1)
      user.level_points += Number(1)
      user.save()
      this.logconsole(`${user.user_id} leveled up`, client)
      const embededd = new MessageEmbed()
      .setTitle(`Level Up`)
      .setColor('#25c059')
      .setDescription(`<@${int.user.id}> leveled up!`)
      int.channel.send({ embeds: [embededd] })
      this.levelup(int, user, client)
    } else {
      return
    }
  },
  die: function (int, cause, user, userEffects, client) {
    user.health = Number(1)
    user.balance = 0
    user.death_count += Number(1)
    user.save()
    userEffects.save()
    this.clearStatus(userEffects)
    this.log(cause, int, client)
    const embededd = new MessageEmbed()
      .setTitle(`Death`)
      .setColor('#25c059')
      .setDescription(`<@${user.user_id}> ${cause}`)
    return int.reply({ embeds: [embededd] })
  },
  updateEffects: function (message, user, userEffects) {
    if (userEffects.burn > 0) {
      user.health -= Number(2)
      userEffects.burn -= Number(1)
      user.save()
      userEffects.save()
      if (userEffects.burn < 1) {
        const embededd = new MessageEmbed()
        .setTitle(`Effects`)
        .setColor('#25c059')
        .setDescription(`Debuff 'On Fire' removed from <@${int.user.id}>`)
        message.channel.send({ embeds: [embededd] })
      }
      return cause = 'burned to a crisp!'
    }
    if (userEffects.poison > 0) {
      user.health -= Number(1)
      userEffects.burn -= Number(1)
      user.save()
      userEffects.save()
      if (userEffects.poison < 1) {
        const embededd = new MessageEmbed()
        .setTitle(`Effects`)
        .setColor('#25c059')
        .setDescription(`Debuff 'Poison' removed from <@${int.user.id}>`)
        message.channel.send({ embeds: [embededd] })
      }
      return cause = 'did not get the antidote in time!'
    }
    return cause = 'passed away!'
  },

  startsWithVowel: function (string) {
    string = String(string);

    return (string.charAt(0) === 'a' || string.charAt(0) === 'e' || string.charAt(0) === 'i' || string.charAt(0) === 'o' || string.charAt(0) === 'u');
  }
}