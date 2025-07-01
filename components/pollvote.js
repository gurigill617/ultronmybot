import { polls } from '../commands/poll.js'; // If shared, export polls from poll.js
import { ButtonInteraction } from 'discord.js';

export default {
  customId: /^vote_\d+$/,

  async execute(interaction) {
    const poll = polls.get(interaction.message.id);
    if (!poll) {
      return interaction.reply({ content: '⚠️ This poll is no longer active.', ephemeral: true });
    }

    const optionIndex = parseInt(interaction.customId.split('_')[1]);
    poll.votes.set(interaction.user.id, optionIndex);

    const voteCount = Array(poll.options.length).fill(0);
    for (const vote of poll.votes.values()) {
      voteCount[vote]++;
    }

    const resultText = poll.options
      .map((opt, i) => `🔘 **${opt}** — ${voteCount[i]} vote(s)`)
      .join('\n');

    const updatedEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('📊 Poll (Live)')
      .setDescription(`**${poll.question}**\n\n${resultText}`)
      .setFooter({ text: `⏳ Poll in progress • ${poll.votes.size} total vote(s)` })
      .setTimestamp();

    await interaction.update({ embeds: [updatedEmbed] });
  }
};
