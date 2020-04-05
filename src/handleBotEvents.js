const readyEvent = require('./events/ready');
const messageEvent = require('./events/message');
const memberLeaveEvent = require('./events/memberLeave');

module.exports = function (bot) {
  bot.once('ready', () => {
    // * Returns logChannel (Discord TextChannel Class)
    readyEvent(bot.user, bot.channels, bot.commands);
  });

  bot.on('message', (message) => {
    messageEvent(message);
  });

  // bot.on('guildMemberRemove', async (member) => {
  //   handleMemberLeave(member, db, logChannel);
  // });
};
