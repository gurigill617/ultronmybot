import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('delrole')
    .setDescription('Remove any selected role from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Select the role to remove')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    const botMember = await interaction.guild.members.fetchMe();
    if (role.position >= botMember.roles.highest.position) {
      return interaction.reply({ content: '⚠️ I cannot remove that role because it is higher or equal to my highest role.', ephemeral: true });
    }

    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `ℹ️ <@${user.id}> does not have the **${role.name}** role.`, ephemeral: true });
    }

    try {
      await member.roles.remove(role);
      await interaction.reply(`✅ Successfully removed **${role.name}** from <@${user.id}>.`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to remove the role. Do I have permission and role hierarchy access?', ephemeral: true });
    }
  }
};
