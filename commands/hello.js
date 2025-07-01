import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Sends a friendly hello with an embed!'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('👋 Hello!')
      .setDescription('This is your first embedded slash command.')
      .setColor(0x00AE86);

    await interaction.reply({ embeds: [embed] });
  }
};
