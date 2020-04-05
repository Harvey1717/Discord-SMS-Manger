module.exports = function (botUser, botChannels) {
  log.message(`${botUser.username} is online`);
  log.magenta(`Prefix: [${prefix}]`);
  loadCommands('./commands');
  logChannel = botChannels.get(logChannelID);
};
