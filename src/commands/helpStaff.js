const { prefix, groupName, botName, logo, colour } = require('../config/discordConfig.json');
const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'helpStaff',
  description: 'List all staff/admin commands.',
  args: [],
  exampleArgs: [],
  aliases: ['staffCommands', 'staff'],
  guildOnly: true,
  staffOnly: true,
  execute(message) {
    let { commands } = message.client;

    const embed = new RichEmbed()
      .setTitle(`${groupName} ${botName} Bot`)
      .setDescription(
        `
        ------------------------------------------
        • My prefix is: \`${prefix}\`
        ------------------------------------------
        `
      )
      .addField('__**Staff Commands**__', ':pencil:\n')
      .setThumbnail(logo)
      .setColor(colour)
      .setFooter(groupName, logo)
      .setTimestamp();
    commands = commands.filter(command => command.adminOnly || command.staffOnly);
    commands.map(command => {
      embed.addField(
        `\`${prefix}${command.name}\``,
        `
          -**Description**: ${command.description}\n-**Arguements**: ${command.args.join(
          ', '
        )}\n-**Admin Only**: ${command.adminOnly ? 'Yes' : 'No'}\n-**Admin & Staff**:: ${
          command.staffOnly ? 'Yes' : 'No'
        }\n-**Aliases**: ${command.aliases
          .map(aliases => prefix + aliases)
          .join(', ')}\n-**Example**: ${prefix + command.name} ${command.exampleArgs.join(' ')}
          `
      );
    });
    message.channel.send(embed);
  }
};
