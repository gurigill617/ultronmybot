import { Events, ChannelType } from 'discord.js';

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      return interaction.reply({ content: '❌ You must be in your temp voice channel!', ephemeral: true });
    }

    if (!voiceChannel.name.includes(member.user.username)) {
      return interaction.reply({ content: '❌ You are not the owner of this voice channel!', ephemeral: true });
    }

    switch (interaction.customId) {
      case 'lock_vc':
        await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          Connect: false
        });
        await interaction.reply({ content: '🔒 Voice channel locked.', ephemeral: true });
        break;

      case 'unlock_vc':
        await voiceChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          Connect: true
        });
        await interaction.reply({ content: '🔓 Voice channel unlocked.', ephemeral: true });
        break;

      case 'limit_vc':
        await voiceChannel.setUserLimit(1);
        await interaction.reply({ content: '👥 Limit set to 1. You can change manually later.', ephemeral: true });
        break;

      case 'delete_vc':
        await voiceChannel.delete().catch(() => {});
        await interaction.reply({ content: '🗑️ Your voice channel has been deleted.', ephemeral: true });
        break;
    }
  }
};
