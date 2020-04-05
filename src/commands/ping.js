const { botName } = require('../config/discordConfig.json');

module.exports = {
  name: 'ping',
  description: 'Responds to the user with a pong message.',
  args: [],
  exampleArgs: [],
  aliases: [],
  guildOnly: true,
  execute(message) {
    message.channel.send(`**[${botName}]**\n:bell: :bell:\n\`${new Date().getTime() - message.createdTimestamp}ms\``)
  }
};
