import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('📊 Shows detailed info about this server'),

  async execute(interaction) {
    const { guild } = interaction;

    const owner = await guild.fetchOwner();

    const totalMembers = guild.memberCount;
    const totalRoles = guild.roles.cache.size;
    const totalChannels = guild.channels.cache.size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount;

    const embed = new EmbedBuilder()
      .setTitle(`📄 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor('#3498db')
      .addFields(
        { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
        { name: '📅 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Members', value: `${totalMembers}`, inline: true },
        { name: '📁 Channels', value: `💬 ${textChannels} | 🔊 ${voiceChannels}`, inline: true },
        { name: '🎭 Roles', value: `${totalRoles}`, inline: true },
        { name: '🚀 Boosts', value: `${boostCount} (Level ${boostLevel})`, inline: true },
        { name: '🆔 Server ID', value: `${guild.id}`, inline: false }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
