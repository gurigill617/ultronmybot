import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set a role to automatically assign on member join')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const guildId = interaction.guild.id;

    let autoRoles = {};

    try {
      const raw = fs.readFileSync('./data/autorole.json');
      autoRoles = JSON.parse(raw);
    } catch (e) {
      // File might not exist yet
    }

    autoRoles[guildId] = role.id;

    fs.writeFileSync('./data/autorole.json', JSON.stringify(autoRoles, null, 2));
    await interaction.reply(`✅ Auto-role for **${interaction.guild.name}** set to **${role.name}**`);
  }
};
