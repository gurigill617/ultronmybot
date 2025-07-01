import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('emotes')
    .setDescription('📦 View all custom emojis in this server'),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;

    if (!emojis.size) {
      return interaction.reply({
        content: '😕 This server has no custom emojis.',
        ephemeral: true
      });
    }

    const emojiChunks = [];
    let currentChunk = '';

    for (const emoji of emojis.values()) {
      const emojiText = emoji.animated
        ? `<a:${emoji.name}:${emoji.id}> `
        : `<:${emoji.name}:${emoji.id}> `;
      if ((currentChunk + emojiText).length > 1000) {
        emojiChunks.push(currentChunk);
        currentChunk = emojiText;
      } else {
        currentChunk += emojiText;
      }
    }

    if (currentChunk) emojiChunks.push(currentChunk);

    const embeds = emojiChunks.map((chunk, index) => {
      return new EmbedBuilder()
        .setTitle(`📦 Custom Emojis (Page ${index + 1}/${emojiChunks.length})`)
        .setDescription(chunk)
        .setColor('Random')
        .setFooter({
          text: `Total emojis: ${emojis.size}`,
          iconURL: interaction.guild.iconURL({ dynamic: true })
        });
    });

    // Only show first page for now
    await interaction.reply({ embeds: [embeds[0]] });

    // Optional: I can also make this paginated with buttons or menus — just ask!
  }
};
