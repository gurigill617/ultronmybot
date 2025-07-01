import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import { welcomeSettings } from '../data/welcomeStore.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set a custom welcome message')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select welcome channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Enter your custom welcome message')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    welcomeSettings[interaction.guild.id] = {
      channel: channel.id,
      message
    };

    await interaction.reply({
      content: `✅ Welcome message set for ${channel}!\nPreview:\n\n${message
        .replace(/{user}/g, `<@${interaction.user.id}>`)
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{memberCount}/g, interaction.guild.memberCount)
      }`,
      ephemeral: true
    });
  }
};
