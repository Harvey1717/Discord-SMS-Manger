const log = require('@harvey1717/logger')();

const handleCommandLoading = require('../handlers/commandLoading');
const { prefix, logChannelID } = require('../../config/discordConfig.json');

module.exports = function (botUser, botChannels, botCommands) {
  log.message(`${botUser.username} is online`);
  log.magenta(`Prefix: [${prefix}]`);
  handleCommandLoading(botCommands);
  logChannel = botChannels.fetch(logChannelID);
};
