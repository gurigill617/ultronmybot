import { EmbedBuilder } from 'discord.js';
import { welcomeSettings } from '../data/welcomeStore.js';
import fs from 'fs';

export default {
  name: 'guildMemberAdd',

  async execute(member) {
    const settings = welcomeSettings[member.guild.id];
    if (!settings) return;

    const channel = member.guild.channels.cache.get(settings.channel);
    if (!channel) return;

    // 🔰 Auto-Role logic starts here
    try {
      const raw = fs.readFileSync('./data/autorole.json');
      const autoRoles = JSON.parse(raw);

      const roleId = autoRoles[member.guild.id];
      if (roleId) {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          await member.roles.add(role);
          console.log(`✅ Auto-role '${role.name}' assigned to ${member.user.tag}`);
        }
      }
    } catch (err) {
      console.warn('⚠️ No autorole set or failed to assign role:', err.message);
    }

    // 📝 Format welcome message
    const msg = settings.message
      .replace(/{user}/g, `<@${member.user.id}>`)
      .replace(/{server}/g, member.guild.name)
      .replace(/{memberCount}/g, member.guild.memberCount);

    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle(`👋 Welcome to ${member.guild.name}`)
      .setDescription(msg)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Welcome ${member.user.username}!` })
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Failed to send welcome message:', err);
    }
  }
};
