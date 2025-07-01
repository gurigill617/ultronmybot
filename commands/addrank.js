import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('addrank')
    .setDescription('Assigns a rank role to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to give the rank to')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The rank role to assign')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    }

    const botMember = await interaction.guild.members.fetchMe();
    if (role.position >= botMember.roles.highest.position) {
      return interaction.reply({ content: '⚠️ I cannot assign that role because it is equal to or higher than my highest role.', ephemeral: true });
    }

    if (member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `🔔 <@${user.id}> already has the **${role.name}** role.`, ephemeral: true });
    }

    try {
      await member.roles.add(role);
      await interaction.reply(`✅ <@${user.id}> has been given the **${role.name}** role.`);
    } catch (err) {
      console.error('Error while assigning role:', err);
      if (!interaction.replied) {
        return interaction.reply({ content: '❌ I could not assign the role. Do I have Manage Roles permission?', ephemeral: true });
      }
    }
  }
};
