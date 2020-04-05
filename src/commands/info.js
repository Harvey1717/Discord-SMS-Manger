const { RichEmbed } = require('discord.js');
const handleError = require('../scripts/handleError.js');
const { botName, groupName, colour, logo } = require('../config/discordConfig.json');

module.exports = {
  name: 'info',
  description: 'Responds with your SMS information.',
  args: [],
  exampleArgs: [],
  aliases: ['smsinfo'],
  guildOnly: true,
  execute(message, args, logChannel, db) {
    db.find({ discordUserID: message.author.id }, (err, docs) => {
      if (err) return handleError(err, logChannel);
      if (docs.length !== 0) {
        embed = new RichEmbed()
          .setTitle(`${groupName} ${botName} Bot`)
          .setDescription('*Here is your SMS information!*')
          .addField('Mobile Number', docs[0].sms.mobileNumber, true)
          .addField('User', `<@${docs[0].discordUserID}>`, true)
          .addField('Signup Date', docs[0].sms.signupDate.toTimeString())
          .setThumbnail(message.author.avatarURL)
          .setColor(colour)
          .setFooter(groupName, logo)
          .setTimestamp();
        message.channel.send(embed);
      } else {
        return message.channel.send('No SMS information found.');
      }
    });
  }
};
