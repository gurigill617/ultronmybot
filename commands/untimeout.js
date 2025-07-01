import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('🔊 Remove timeout from a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to remove timeout from')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for removing timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '⚠️ I cannot untimeout this member.', ephemeral: true });
    }

    try {
      await member.timeout(null, reason); // null = remove timeout
      await interaction.reply(`✅ Timeout removed from <@${user.id}>.\n📝 Reason: *${reason}*`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to remove timeout. Check my permissions.', ephemeral: true });
    }
  }
};
