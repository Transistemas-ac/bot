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
    console.log("📡 Registrando comandos...");
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log(
      "✅ Comandos registrados correctamente:",
      data.map((c) => c.name)
    );
  } catch (error) {
    console.error("❌ Error al registrar comandos:", error);
  }
}

client.once("clientReady", async () => {
  console.log(`🚀 ${client.user.tag} está en línea!`);

  for (const [id, guild] of client.guilds.cache) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, id),
        { body: commands }
      );
      console.log(`✅ Comandos registrados en ${guild.name}`);
    } catch (error) {
      console.error(`❌ Error al registrar en ${guild.name}:`, error);
    }
  }

  await initRoleMessage(client, process.env.CHANNEL_ID_ROLES);
  await initRulesMessage(client, process.env.CHANNEL_ID_REGLAS);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  }
});

registerEvents(client);

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
