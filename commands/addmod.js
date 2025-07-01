import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('addmod')
    .setDescription('Assigns the Moderator role to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to make a moderator')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can use

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find that user in the server.', ephemeral: true });
    }

    const modRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'moderator');

    if (!modRole) {
      return interaction.reply({ content: '⚠️ No role named "Moderator" found in this server.', ephemeral: true });
    }

    if (member.roles.cache.has(modRole.id)) {
      return interaction.reply({ content: '🔔 This user is already a moderator.', ephemeral: true });
    }

    try {
      await member.roles.add(modRole);
      await interaction.reply(`✅ <@${user.id}> has been given the **Moderator** role.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ I could not assign the role. Make sure my role is above the Moderator role and I have Manage Roles permission.', ephemeral: true });
    }
  }
};
