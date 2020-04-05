const twilio = require('twilio');
const { RichEmbed } = require('discord.js');
const log = require('@harvey1717/logger')();
const handleError = require.main.require('./handlers/error.js');

const { accountSID, authToken, allowedMobileCodes } = require.main.require(
  '../config/smsConfig.json'
);
const { groupName, botName, logo } = require.main.require('../config/discordConfig.json');
const client = new twilio(accountSID, authToken);

module.exports = {
  name: 'register',
  description: 'Allows you to add your mobile number.',
  args: ['<Number>'],
  exampleArgs: ['+447825637466'],
  aliases: ['signup'],
  guildOnly: true,
  customModule: 'sms',
  async execute(message, args, logChannel, db) {
    const phoneNumber = args[0];

    // * Check if number is supported by bot
    if (allowedMobileCodes.some((item) => phoneNumber.startsWith(item.code)) === false)
      return message.channel.send('Your phone number is currently not supported.');

    // * Check with Twilio if number is valid
    [err, data] = await to(client.lookups.phoneNumbers(phoneNumber).fetch());
    if (err) return message.channel.send('Your number is invalid.');
    db.find({ discordUserID: message.author.id }, (err, docs) => {
      if (docs.length !== 0) {
        return message.channel.send('You have already signed up for SMS notifications.');
      }
      db.insert(
        {
          originalTag: message.author.tag,
          discordUserID: message.author.id,
          sms: { mobileNumber: phoneNumber, signupDate: new Date() },
        },
        (err) => {
          if (err) return handleError(err, logChannel);
          embed = new RichEmbed()
            .setTitle(`${groupName} ${botName} Bot`)
            .setDescription(`*User ${message.author.tag} registered their number*`)
            .addField('Provided number', `||${phoneNumber}||`)
            .addField('User ID', message.author.id)
            .setThumbnail(message.author.avatarURL)
            .setColor('00FF00')
            .setFooter(groupName, logo)
            .setTimestamp();
          logChannel.send(embed);
          message.channel.send(embed);
          log.success(`User signed up for SMS: ${message.author.tag}`);
        }
      );
    });
  },
};
