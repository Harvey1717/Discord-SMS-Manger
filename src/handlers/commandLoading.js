const fs = require('fs');
const log = require('@harvey1717/logger')();

const { extraModules } = require('../../config/discordConfig');

module.exports = function (botCommands) {
  loadBaseCommands(botCommands);
  loadModules(botCommands);
};

function loadBaseCommands(botCommands) {
  // * Get all files in the commands directory
  log.magenta('Loading module: GENERAL');
  readDir('commands')
    .then((data) => {
      loadAllCommands(botCommands, data);
    })
    .catch((err) => console.log(err));
}

function loadModules(botCommands) {
  // * Get all folders in the commands/modules directory
  fs.readdir('./src/commands/modules', null, (err, data) => {
    if (err) throw err;
    // * Filter out all files (keep folders)
    const modules = data.filter((file) => !file.includes('.'));
    const enrolledModules = [];
    for (const module of modules) {
      if (extraModules.includes(module)) enrolledModules.push(module);
    }
    for (const enrolledModule of enrolledModules) {
      log.magenta(`Loading module: ${enrolledModule.toLocaleUpperCase()}`);
      readDir(`commands/modules/${enrolledModule}`)
        .then((data) => {
          loadAllCommands(botCommands, data, `/modules/${enrolledModule}`);
        })
        .catch((err) => console.log(err));
    }
    // log.magenta('--------------------');
  });
}

function loadAllCommands(botCommands, wholeDir, dirExt = '') {
  // * Filter out non JS files
  const commandFiles = wholeDir.filter((file) => file.endsWith('.js'));
  // * Add command and data to the collection of commands
  for (const file of commandFiles) {
    try {
      const command = require(`../commands${dirExt}/${file}`);
      botCommands.set(command.name.toLowerCase(), command);
      log.log(`Loaded: ${file}`);
    } catch (error) {
      log.error(`Error loading: ${file}`);
      console.log(error);
    }
  }
}

function readDir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(`./src/${dir}`, null, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
