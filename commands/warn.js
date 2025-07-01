import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Warn a member for breaking the rules')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot warn yourself.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('⚠️ You have been warned')
      .setDescription(`**Reason:** ${reason}\n**Server:** ${interaction.guild.name}`)
      .setColor('Yellow')
      .setTimestamp();

    // DM the user
    try {
      await target.send({ embeds: [embed] });
    } catch {
      console.warn(`⚠️ Couldn't DM ${target.tag}`);
    }

    // Log in current channel
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('User Warned')
          .addFields(
            { name: '👤 User', value: `<@${target.id}>`, inline: true },
            { name: '🛡️ Warned By', value: `<@${interaction.user.id}>`, inline: true },
            { name: '📄 Reason', value: reason }
          )
          .setColor('Orange')
          .setTimestamp()
      ]
    });

    // (Optional): Save to DB or file if you want persistent records
  }
};
