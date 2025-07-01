import { SlashCommandBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import { recommendations } from '../utils/recommendations.js';

const intervals = new Map(); // guildId => interval

function getRandomRecommendation() {
  const type = Math.random() < 0.5 ? 'movie' : 'anime';
  const genre = Math.random() < 0.5 ? 'action' : 'romance';
  const moods = ['happy', 'sad', 'intense'];
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const list = recommendations[type][genre][mood];
  const title = list[Math.floor(Math.random() * list.length)];

  return { type, genre, mood, title };
}

export default {
  data: new SlashCommandBuilder()
    .setName('autorecommend')
    .setDescription('Automatically send movie/anime recommendations at intervals')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send recommendations in')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addIntegerOption(option =>
      option.setName('interval')
        .setDescription('Interval in minutes (default: 10)')
        .setMinValue(1)
        .setMaxValue(60)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const minutes = interaction.options.getInteger('interval') || 10;

    // Clear any existing interval
    const existing = intervals.get(interaction.guild.id);
    if (existing) clearInterval(existing);

    const interval = setInterval(() => {
      const { type, genre, mood, title } = getRandomRecommendation();

      const embed = new EmbedBuilder()
        .setTitle(`🎬 ${type.toUpperCase()} Recommendation`)
        .setDescription(`**Genre:** ${genre}\n**Mood:** ${mood}\n\n🎉 **${title}**`)
        .setColor(type === 'movie' ? 0x00bfff : 0xff66cc)
        .setFooter({ text: `New drop every ${minutes} mins!` });

      channel.send({ embeds: [embed] });
    }, minutes * 60 * 1000);

    intervals.set(interaction.guild.id, interval);

    await interaction.reply({
      content: `✅ Auto-recommendation started in ${channel} every ${minutes} minutes.`,
      ephemeral: true
    });
  }
};
