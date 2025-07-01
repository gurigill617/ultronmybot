import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('🧹 Delete messages in bulk (even older than 14 days)')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1–100)')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Only delete messages from this user')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '❌ Enter a number between 1 and 100.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const fetched = await interaction.channel.messages.fetch({ limit: 100 });

      let messagesToDelete;

      if (user) {
        messagesToDelete = fetched
          .filter(msg => msg.author.id === user.id)
          .first(amount);
      } else {
        messagesToDelete = fetched.first(amount);
      }

      const messages = [...messagesToDelete];

      // If any message is older than 14 days, use individual delete
      let deletedCount = 0;

      for (const msg of messages) {
        await msg.delete().catch(() => null);
        deletedCount++;
      }

      await interaction.editReply(`✅ Deleted **${deletedCount}** message(s) ${user ? `from <@${user.id}>` : ''}.`);
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Could not delete messages. Check my permissions or try again.');
    }
  }
};
