const log = require('@harvey1717/logger')();

const handleCommandLoading = require.main.require('./handlers/commandLoading');
const { prefix, logChannelID } = require.main.require('../config/discordConfig.json');

module.exports = function (botUser, botChannels, botCommands) {
  log.message(`${botUser.username} is online`);
  log.message(`Prefix: [${prefix}]`);
  handleCommandLoading(botCommands);
  logChannel = botChannels.fetch(logChannelID);
};
