module.exports = function(message) {
  // * Return if message doesn't start with prefix
  // * or was sent by the bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();

  // * Find command in ./commands and search for aliases
  const command =
    bot.commands.get(commandName) ||
    bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (
    message.channel.type === 'dm' &&
    (command.guildOnly || command.staffOnly || command.adminOnly)
  ) {
    return message.channel.send('This message cannot be used in DMs.');
  }

  if (args.length < command.args.filter((arg) => arg.startsWith('<')).length) {
    return message.channel.send(
      `Please provide all arguements: \`${command.args.join(', ')}\``
    );
  } else if (
    args.length > command.args.length &&
    command.args.some((arg) => arg.startsWith('< ') === false)
  )
    return message.channel.send(
      `Too many arguements, please provide: \`${command.args.join(', ')}\``
    );

  if (command.adminOnly) {
    // * User doesn't have an admin role
    if (message.member.roles.some((role) => adminRoleIDs.includes(role.id)) === false) {
      const adminRoles = message.guild.roles.filter((role) =>
        adminRoleIDs.includes(role.id)
      );
      const adminRoleNames = adminRoles.map((role) => role.name);
      return message.channel.send(
        `This is an admin only command. You must have one of the following roles to use it:\n\`${adminRoleNames.join(
          ', '
        )}\``
      );
    }
    // * User doesn't have a staff role
  } else if (command.staffOnly) {
    if (
      message.member.roles.some((role) => staffRoleIDs.includes(role.id)) === false &&
      message.member.roles.some((role) => adminRoleIDs.includes(role.id)) === false
    ) {
      const adminRoles = message.guild.roles.filter((role) =>
        adminRoleIDs.includes(role.id)
      );
      const adminRoleNames = adminRoles.map((role) => role.name);
      const staffRoles = message.guild.roles.filter((role) =>
        staffRoleIDs.includes(role.id)
      );
      const staffRoleNames = staffRoles.map((role) => role.name);
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
