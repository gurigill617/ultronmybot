import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

const polls = new Map(); // In-memory vote tracking

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('📊 Create a poll in the server')
    .addStringOption(opt =>
      opt.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption(opt =>
      opt.setName('options').setDescription('Comma-separated options (2 to 5)').setRequired(false)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const rawOptions = interaction.options.getString('options');

    let pollOptions;
    if (rawOptions) {
      pollOptions = rawOptions.split(',').map(opt => opt.trim()).filter(opt => opt);
      if (pollOptions.length < 2 || pollOptions.length > 5) {
        return interaction.reply({
          content: '❌ You must provide between 2 and 5 options.',
          ephemeral: true
        });
      }
    } else {
      pollOptions = ['Yes', 'No'];
    }

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('📊 Poll')
      .setDescription(`**${question}**\n\n${pollOptions.map((opt, i) => `🔘 **${opt}**`).join('\n')}`)
      .setFooter({ text: `Vote using buttons below • Poll by ${interaction.user.username}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      pollOptions.map((opt, i) =>
        new ButtonBuilder()
          .setCustomId(`vote_${i}`)
          .setLabel(opt)
          .setStyle(ButtonStyle.Primary)
      )
    );

    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    polls.set(msg.id, {
      question,
      options: pollOptions,
      votes: new Map() // Map<userId, optionIndex>
    });

    setTimeout(() => {
      polls.delete(msg.id);
      try {
        msg.edit({
          components: [],
          embeds: [EmbedBuilder.from(embed).setFooter({ text: '⏰ Poll Closed' })]
        });
      } catch {}
    }, 2 * 60 * 1000); // poll ends in 2 minutes (you can change this)
  }
};

// 🧠 Create a separate file: `components/pollVote.js`
