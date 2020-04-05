const { RichEmbed } = require('discord.js')
const log = require('@harvey1717/logger')();
const handleError = require('../scripts/handleError.js');
const { accountSID, authToken, serviceSID } = require('../config/smsConfig.json');
const twilio = require('twilio')(accountSID, authToken);
const { groupName, botName, logo, colour } = require('../config/discordConfig.json');

module.exports = {
  name: 'send',
  description: 'Sends a text message to all users.',
  args: ['< Message Content >'],
  exampleArgs: ['This is a test message'],
  aliases: ['sms'],
  guildOnly: true,
  adminOnly: true,
  execute(message, args, logChannel, db) {
    const content = `NIGHTOWL SMS:\n${args.join(' ')}`;
    db.find({}, (err, docs) => {
      if (err) return handleError(err, logChannel);
      const numbers = docs.filter(doc => doc.sms).map(doc => doc.sms.mobileNumber);
      Promise.all(
        numbers.map(number => {
          return twilio.messages.create({
            to: number,
            from: serviceSID,
            body: content
          });
        })
      )
        .then(() => {
          const embed = new RichEmbed()
            .setTitle(`${groupName} ${botName} Bot`)
            .setDescription(`*New message sent from ${message.author.tag}*`)
            .addField('Message contet', `\`\`\`${content}\`\`\``)
            .addField('Sent at', new Date().toTimeString())
            .addField('Sent to', `${numbers.length} people`)
            .setThumbnail(message.author.avatarURL)
            .setColor(colour)
            .setFooter(groupName, logo)
            .setTimestamp();
          message.channel.send(embed);
          logChannel.send(embed);
          log.success(`Send SMS command executed. Sent to: [${numbers.length}]`);
        })
        .catch(err => handleError(err));
    });
  }
};
