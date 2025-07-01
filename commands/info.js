import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import process from 'process';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('ℹ️ Show basic bot information'),

  async execute(interaction) {
    const uptime = process.uptime(); // in seconds
    const formatUptime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const totalCommands = interaction.client.commands.size;

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Info')
      .setColor('#5865F2')
      .addFields(
        { name: '🧠 Name', value: `${interaction.client.user.username}`, inline: true },
        { name: '📡 Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
        { name: '📅 Uptime', value: `${formatUptime(uptime)}`, inline: true },
        { name: '👤 Developer', value: `_ultronyt`, inline: true },
        { name: '🛡️ Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true },
        { name: '📦 Total Commands', value: `${totalCommands}`, inline: true }
      )
      .setFooter({ text: 'ULTRON CORE - Status Active 🟢' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
