import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { pathToFileURL } from 'url';

config(); // Load .env

// Read config.json
const configJson = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const commands = [];
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Read command files
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(pathToFileURL(filePath).href);
  if (command?.default?.data) {
    commands.push(command.default.data.toJSON());
  } else {
    console.warn(`⚠️ Skipped ${file} — missing valid export.`);
  }
}

// Initialize REST
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('🌍 Deploying **GLOBAL** slash commands...');

  // Global deployment (remove guildId)
  await rest.put(
    Routes.applicationCommands(configJson.clientId),
    { body: commands }
  );

  console.log('✅ Global slash commands deployed successfully!');
} catch (error) {
  console.error('❌ Failed to deploy global commands:', error);
}
