import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Give a role to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Select the role to assign')
        .setRequired(true))
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
      return interaction.reply({ content: '⚠️ I cannot assign that role because it is higher or equal to my highest role.', ephemeral: true });
    }

    if (member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `🔔 <@${user.id}> already has the **${role.name}** role.`, ephemeral: true });
    }

    try {
      await member.roles.add(role);
      await interaction.reply(`✅ <@${user.id}> has been given the **${role.name}** role.`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Failed to assign the role. Check my permissions.', ephemeral: true });
    }
  }
};
