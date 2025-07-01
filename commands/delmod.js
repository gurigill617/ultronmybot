import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('delmod')
    .setDescription('❌ Remove moderator role from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user to remove moderator role from')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    }

    // Replace with the exact name of the mod role you created via /addmod
    const modRoleName = 'Moderator';

    const modRole = interaction.guild.roles.cache.find(role => role.name === modRoleName);
    if (!modRole) {
      return interaction.reply({ content: `⚠️ Moderator role "${modRoleName}" not found.`, ephemeral: true });
    }

    // Check if user has that role
    if (!member.roles.cache.has(modRole.id)) {
      return interaction.reply({ content: `ℹ️ <@${user.id}> doesn't have the **${modRole.name}** role.`, ephemeral: true });
    }

    try {
      await member.roles.remove(modRole);
      await interaction.reply({
        content: `✅ <@${user.id}> has been removed from the **${modRole.name}** role.`,
        ephemeral: false
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: `❌ Failed to remove role. Do I have the right permissions?`,
        ephemeral: true
      });
    }
  }
};
