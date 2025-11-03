import { REST, Routes } from "discord.js";
import { commands } from "../commands/index.js";

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

export async function registerAllCommands(client) {
  const commandsData = commands.map((cmd) => cmd.data.toJSON());

  for (const [id, guild] of client.guilds.cache) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, id),
        { body: commandsData }
      );
      console.log(`✅ Comandos registrados en ${guild.name}`);
    } catch (error) {
      console.error(`❌ Error al registrar en ${guild.name}:`, error);
    }
  }
}
