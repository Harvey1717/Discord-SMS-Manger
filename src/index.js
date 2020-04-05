const fs = require('fs');
const Discord = require('discord.js');
const Datastore = require('nedb');
const log = require('@harvey1717/logger')();
const {
  prefix,
  token,
  logChannelID,
  staffRoleIDs,
  adminRoleIDs
} = require('./config/discordConfig.json');
const { dbDir } = require('./config/dbConfig.json');
const handleMemberLeave = require('./scripts/handleMemberLeave.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let db,
  logChannel = undefined;

// * Completed commands:
// * - ping
// * - register
// * - help
// * - info
// * Admin and Staff only compatibility
// TODO
// * - send
// TODO

// * On Ready
bot.once('ready', () => {
  log.message(`${bot.user.username} is online`);
  log.magenta(`Prefix: [${prefix}]`);
  loadCommands('./commands');
  logChannel = bot.channels.get(logChannelID);
});

// * On Message
bot.on('message', message => {
  handleCommands(message);
});

// * On Member Leaving
bot.on('guildMemberRemove', async member => {
  handleMemberLeave(member, db, logChannel);
});

loadDB();

// * Login as the bot
function loadDB() {
  db = new Datastore({
    filename: dbDir,
    autoload: true,
    onload: err => {
      if (err) console.log(err);
      else {
        log.message('Loaded Database');
        bot.login(token);
      }
    }
  });
}

function loadCommands(commandsFile) {
  // * Get all files in the ./commands directory
  fs.readdir(commandsFile, null, (err, data) => {
    if (err) throw err;
    // * Filter out non JS files
    const commandFiles = data.filter(file => file.endsWith('.js'));
    // * Add command and data to the collection of commands
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      bot.commands.set(command.name.toLowerCase(), command);
    }
    log.magenta(`Commands loaded: [${commandFiles.length}]`);
    log.magenta('--------------------');
  });
}

function handleCommands(message) {
  // * Return if message doesn't start with prefix
  // * or was sent by the bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();

  // * Find command in ./commands and search for aliases
  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (
    message.channel.type === 'dm' &&
    (command.guildOnly || command.staffOnly || command.adminOnly)
  ) {
    return message.channel.send('This message cannot be used in DMs.');
  }

  if (args.length < command.args.filter(arg => arg.startsWith('<')).length) {
    return message.channel.send(`Please provide all arguements: \`${command.args.join(', ')}\``);
  } else if (
    args.length > command.args.length &&
    command.args.some(arg => arg.startsWith('< ') === false)
  )
    return message.channel.send(
      `Too many arguements, please provide: \`${command.args.join(', ')}\``
    );

  if (command.adminOnly) {
    // * User doesn't have an admin role
    if (message.member.roles.some(role => adminRoleIDs.includes(role.id)) === false) {
      const adminRoles = message.guild.roles.filter(role => adminRoleIDs.includes(role.id));
      const adminRoleNames = adminRoles.map(role => role.name);
      return message.channel.send(
        `This is an admin only command. You must have one of the following roles to use it:\n\`${adminRoleNames.join(
          ', '
        )}\``
      );
    }
    // * User doesn't have a staff role
  } else if (command.staffOnly) {
    if (
      message.member.roles.some(role => staffRoleIDs.includes(role.id)) === false &&
      message.member.roles.some(role => adminRoleIDs.includes(role.id)) === false
    ) {
      const adminRoles = message.guild.roles.filter(role => adminRoleIDs.includes(role.id));
      const adminRoleNames = adminRoles.map(role => role.name);
      const staffRoles = message.guild.roles.filter(role => staffRoleIDs.includes(role.id));
      const staffRoleNames = staffRoles.map(role => role.name);
      return message.channel.send(
        `This is a staff only command. You must have one of the following roles to use it:\n\`${adminRoleNames.join(
          ', '
        )}, ${staffRoleNames.join(', ')}\``
      );
    }
  }

  // * Attempt to execute the command
  try {
    command.execute(message, args, logChannel, db);
  } catch (error) {
    console.error(error);
    message.reply('Your command could not be executed.');
  }
}
