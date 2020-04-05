const log = require('@harvey1717/logger')();
const fs = require('fs');

module.exports = function (botCommands) {
  // * Get all files in the ./commands directory
  fs.readdir('./src/commands', null, (err, data) => {
    if (err) throw err;
    // console.log(data)
    // * Filter out non JS files
    const commandFiles = data.filter((file) => file.endsWith('.js'));
    // * Add command and data to the collection of commands
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      botCommands.set(command.name.toLowerCase(), command);
    }

    log.magenta(`Commands loaded: [${commandFiles.length}]`);
    log.magenta('--------------------');
  });
};
