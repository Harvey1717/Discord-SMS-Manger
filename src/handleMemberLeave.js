const log = require('@harvey1717/logger')();
const { RichEmbed } = require('discord.js');
const { groupName, botName, logo } = require('../config/discordConfig.json');

function handleError(err, logChannel) {
  console.log(err);
  logChannel.send(err);
}

module.exports = (member, db, logChannel) => {
  db.remove({ discordUserID: member.user.id}, {}, (err, numRemoved) => {
    if (err) return handleError(err, logChannel)
    if (numRemoved > 0) {
      const embed = new RichEmbed()
        .setTitle(`${groupName} ${botName} Bot`)
        .setDescription(`*User ${member.user.tag} has left. Their number has been removed*`)
        .addField('User ID', member.user.id)
        .setThumbnail(member.user.avatarURL)
        .setColor('b642f5')
        .setFooter(groupName, logo)
        .setTimestamp();
      logChannel.send(embed);
      log.log(`Member left server and removed from DB: ${member.user.tag}`);
    } else {
      log.log(`Member left but not in DB: ${member.user.tag}`);
    }
  });
  
};
