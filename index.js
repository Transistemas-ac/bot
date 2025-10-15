import "dotenv/config";
import { client } from "./src/config.js";
import { initRoleMessage } from "./src/messages/roles.js";
import { initRulesMessage } from "./src/messages/rules.js";
import { registerEvents } from "./src/events/index.js";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con pong."),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

async function registerCommands() {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Comandos registrados correctamente.");
  } catch (error) {
    console.error("❌ Error al registrar comandos:", error);
  }
}

client.once("ready", async () => {
  await initRoleMessage(client, process.env.CHANNEL_ID_ROLES);
  await initRulesMessage(client, process.env.CHANNEL_ID_REGLAS);
  console.log(`🚀 ${client.user.tag} está en línea!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  }
});

registerEvents(client);
await registerCommands();

client.login(process.env.BOT_TOKEN).catch(() => {
  console.error(
    "❌ Error al iniciar sesión en Discord. ¡Verifica tu BOT_TOKEN!"
  );
});

process.on("SIGINT", () => {
  console.log("👋 Apagando el bot...");
  client.destroy();
  process.exit(0);
});
