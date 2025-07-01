import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Shows a preview of the HEX color you choose')
    .addStringOption(option =>
      option.setName('hex')
        .setDescription('Enter a HEX code (example: #ff5733)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const hex = interaction.options.getString('hex').replace('#', '');

    // HEX validation
    const isValidHex = /^([A-Fa-f0-9]{6})$/.test(hex);
    if (!isValidHex) {
      return interaction.reply({
        content: '❌ Invalid HEX code. Please provide a valid 6-digit HEX (e.g., `#1abc9c`).',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`🎨 HEX Color: #${hex.toUpperCase()}`)
      .setDescription(`Here is the preview of **#${hex.toUpperCase()}**`)
      .setImage(`https://singlecolorimage.com/get/${hex}/600x200`)
      .setColor(`#${hex}`)
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
