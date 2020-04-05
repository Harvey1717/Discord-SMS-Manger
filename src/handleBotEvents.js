const readyEvent = require('./events/ready');
const messageEvent = require('./events/message');
const memberLeaveEvent = require('./events/memberLeave');

module.exports = function (bot) {
  bot.once('ready', () => {
    // * Returns logChannel (Discord TextChannel Class)
    readyEvent(bot.user, bot.channels);
  });

  bot.on('message', (message) => {
    messageEvent(message);
  });

  bot.on('guildMemberRemove', async (member) => {
    handleMemberLeave(member, db, logChannel);
  });

  function loadCommands(commandsFile) {
    // * Get all files in the ./commands directory
    fs.readdir(commandsFile, null, (err, data) => {
      if (err) throw err;
      // * Filter out non JS files
      const commandFiles = data.filter((file) => file.endsWith('.js'));
      // * Add command and data to the collection of commands
      for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name.toLowerCase(), command);
      }
      log.magenta(`Commands loaded: [${commandFiles.length}]`);
      log.magenta('--------------------');
    });
  }
};
