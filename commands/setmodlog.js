import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';
import fs from 'fs';

const logFilePath = './data/modlog.json';

export default {
  data: new SlashCommandBuilder()
    .setName('setmodlog')
    .setDescription('🔧 Set the channel for mod logs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select a text channel for logs')
        .setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    // ✅ Save to JSON
    let data = {};
    if (fs.existsSync(logFilePath)) {
      data = JSON.parse(fs.readFileSync(logFilePath));
    }
    data[interaction.guild.id] = channel.id;
    fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2));

    return interaction.reply({
      content: `✅ Mod log channel set to <#${channel.id}>`,
      ephemeral: true
    });
  }
};
