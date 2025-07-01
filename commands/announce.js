import {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('📢 Make a public announcement in a selected channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel for announcement')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Write the announcement message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Optional title for the announcement')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color code (e.g., #00ff00)')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName('ping')
        .setDescription('Should @everyone be pinged?')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    const title = interaction.options.getString('title') || '📢 Announcement';
    const color = interaction.options.getString('color') || '#00AAFF';
    const ping = interaction.options.getBoolean('ping') || false;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(color)
      .setFooter({ text: `By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    try {
      if (ping) {
        await channel.send({ content: '@everyone', embeds: [embed] });
      } else {
        await channel.send({ embeds: [embed] });
      }

      await interaction.reply({
        content: `✅ Announcement sent in ${channel}`,
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Failed to send the announcement. Check my permissions.',
        ephemeral: true
      });
    }
  }
};
