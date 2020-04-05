const { prefix, groupName, botName, logo, colour } = require('../config/discordConfig.json');
const { allowedMobileCodes } = require('../config/smsConfig.json');
const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all commands.',
  args: [],
  exampleArgs: [],
  aliases: ['commands'],
  guildOnly: true,
  execute(message) {
    let { commands } = message.client;

    const embed = new RichEmbed()
      .setTitle(`${groupName} ${botName} Bot`)
      .setDescription(
        `
        ------------------------------------------
        • My prefix is: \`${prefix}\`
        • Required arguements are surrounded by \`< >\`
        • Only ${allowedMobileCodes.map(item => item.name).join(', ')} numbers supported
        • Numbers must start with their specific area code (E.G. +1)
        ------------------------------------------
        `
      )
      .addField('__**Commands**__', ':pencil:\n')
      .setThumbnail(logo)
      .setColor(colour)
      .setFooter(groupName, logo)
      .setTimestamp();
    commands = commands.filter(command => !command.adminOnly && !command.staffOnly);
    commands.map(command => {
      embed.addField(
        `\`${prefix}${command.name}\``,
        `
          -**Description**: ${command.description}\n-**Arguements**: ${command.args.join(
          ', '
        )}\n-**Aliases**: ${command.aliases
          .map(aliases => prefix + aliases)
          .join(', ')}\n-**Example**: ${prefix + command.name} ${command.exampleArgs.join(' ')}
          `
      );
    });
    message.channel.send(embed);
  }
};
