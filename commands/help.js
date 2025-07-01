import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📘 View all available bot commands'),

  async execute(interaction) {
    const categories = {
      Moderation: {
        emoji: '🛡️',
        commands: [],
      },
      Admin: {
        emoji: '⚙️',
        commands: [],
      },
      Info: {
        emoji: 'ℹ️',
        commands: [],
      },
      Fun: {
        emoji: '🎉',
        commands: [],
      },
      Utility: {
        emoji: '🧰',
        commands: [],
      },
      Other: {
        emoji: '📦',
        commands: [],
      },
    };

    for (const [name, command] of interaction.client.commands) {
      const category = detectCategory(name);
      categories[category].commands.push({
        name: command.data.name,
        desc: command.data.description,
        usage: generateUsage(command.data),
      });
    }

    const options = Object.entries(categories)
      .filter(([_, cat]) => cat.commands.length > 0)
      .map(([category, cat]) => ({
        label: `${cat.emoji} ${category}`,
        value: category,
        description: `${cat.commands.length} command(s)`,
      }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_select')
      .setPlaceholder('📂 Choose a command category')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(menu);

    const initial = Object.keys(categories).find(cat => categories[cat].commands.length > 0);
    const embed = generateEmbed(initial, categories[initial]);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.customId === 'help_select' && i.user.id === interaction.user.id,
      time: 60000,
    });

    collector.on('collect', async i => {
      const selected = i.values[0];
      const embed = generateEmbed(selected, categories[selected]);
      await i.update({ embeds: [embed], components: [row], ephemeral: true });
    });

    collector.on('end', async () => {
      try {
        await interaction.editReply({ components: [] });
      } catch {}
    });
  },
};

function generateEmbed(title, category) {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`${category.emoji} ${title} Commands`)
    .setDescription(
      category.commands
        .map(
          cmd =>
            `> **/${cmd.name}** — ${cmd.desc}\n> \`\`\`Usage: /${cmd.usage}\`\`\``
        )
        .join('\n')
    )
    .setFooter({ text: `ULTRON.AI Help System`, iconURL: 'https://i.imgur.com/RrHrSOi.png' })
    .setTimestamp();
  return embed;
}

function detectCategory(name) {
  const MOD = ['warn', 'timeout', 'ban', 'untimeout'];
  const ADMIN = ['addrole', 'delrole', 'addrank', 'delrank', 'addmod', 'delmod', 'setmodlog', 'setwelcome', 'setautorole'];
  const INFO = ['userinfo', 'serverinfo', 'avatar', 'ping', 'info'];
  const FUN = ['color', 'hello', 'emotes'];
  const UTIL = ['announce', 'purge'];

  if (MOD.includes(name)) return 'Moderation';
  if (ADMIN.includes(name)) return 'Admin';
  if (INFO.includes(name)) return 'Info';
  if (FUN.includes(name)) return 'Fun';
  if (UTIL.includes(name)) return 'Utility';
  return 'Other';
}

function generateUsage(data) {
  const args = data.options?.map(opt =>
    opt.required ? `<${opt.name}>` : `[${opt.name}]`
  ) || [];
  return `${data.name} ${args.join(' ')}`;
}
