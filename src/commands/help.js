const { MessageEmbed } = require('discord.js');
const { prefix, groupName, logo, colour } = require.main.require(
  '../config/discordConfig.json'
);
const { extraModules } = require.main.require('../config/discordConfig');
const { allowedMobileCodes } = require.main.require('../config/smsConfig.json');

module.exports = {
  name: 'help',
  description: 'List all commands.',
  args: [],
  exampleArgs: [],
  aliases: ['commands'],
  guildOnly: true,
  execute(message) {
    let { commands } = message.client;

    const embed = new MessageEmbed()
      .setTitle(`${groupName} Commands`)
      .setDescription(
        `
        ------------------------------------------
        • My prefix is: \`${prefix}\`
        • Required arguements are surrounded by \`< >\`
        • Only ${allowedMobileCodes.map((item) => item.name).join(', ')} numbers supported
        • Numbers must start with their specific area code (E.G. +1)
        ------------------------------------------
        `
      )
      .setThumbnail(logo)
      .setColor(colour)
      .setFooter(groupName, logo)
      .setTimestamp();

    const generalCommands = commands
      .filter(
        (command) =>
          !command.hasOwnProperty('customModule') &&
          !command.adminOnly &&
          !command.staffOnly
      )
      .map((command) => command.name)
      .join(', ');

    embed.addField('__General__', generalCommands ? `\`${generalCommands}\`` : '`NONE`');

    const adminCommands = commands
      .filter(
        (command) =>
          !command.hasOwnProperty('customModule') &&
          command.adminOnly &&
          !command.staffOnly
      )
      .map((command) => command.name)
      .join(', ');

    embed.addField('__Admin__', adminCommands ? `\`${adminCommands}\`` : '`NONE`');

    const staffCommands = commands
      .filter(
        (command) =>
          !command.hasOwnProperty('customModule') &&
          !command.adminOnly &&
          command.staffOnly
      )
      .map((command) => command.name)
      .join(', ');

    embed.addField('__Staff__', staffCommands ? `\`${staffCommands}\`` : '`NONE`');

    for (let extraModule of extraModules) {
      // console.log(extraModules);
      const moduleCommands = commands
        .filter(
          (command) =>
            command.hasOwnProperty('customModule') && command.customModule === extraModule
        )
        .map((command) =>
          command.adminOnly || command.staffOnly ? `${command.name}^` : command.name
        )
        .join(', ');

      embed.addField(
        `__${extraModule}__`,
        moduleCommands ? `\`${moduleCommands}\`` : '`NONE`'
      );
    }

    message.channel.send(embed);
  },
};
