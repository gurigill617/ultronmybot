import { SlashCommandBuilder, PermissionFlagsBits, time } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('🔇 Timeout a member for a specific time')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to timeout')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Timeout duration (e.g. 1m, 5m, 10m, 1h, 1d)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    // Convert time string to milliseconds
    const timeMs = convertDuration(duration);
    if (!timeMs) {
      return interaction.reply({ content: '❌ Invalid duration format. Use 1m, 5m, 1h, 1d, etc.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '⚠️ I cannot timeout this member.', ephemeral: true });
    }

    try {
      await member.timeout(timeMs, reason);
      await interaction.reply(`✅ <@${user.id}> has been timed out for **${duration}**.\n📝 Reason: *${reason}*`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to timeout the user. Check my permissions.', ephemeral: true });
    }
  }
};

// Utility function to convert '1m', '1h' etc. to milliseconds
function convertDuration(input) {
  const match = input.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return value * multipliers[unit];
}
