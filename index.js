import "dotenv/config";
import { client } from "./src/config.js";
import { initRoleMessage } from "./src/messages/roles.js";
import { initRulesMessage } from "./src/messages/rules.js";
import { registerEvents } from "./src/events/index.js";
import { registerAllCommands } from "./src/utils/commandRegistry.js";
import { handleInteraction } from "./src/handlers/interactionHandler.js";

client.once("clientReady", async () => {
  console.log(`🚀 ${client.user.tag} está en línea!`);

  await registerAllCommands(client);
  await initRoleMessage(client, process.env.CHANNEL_ID_ROLES);
  await initRulesMessage(client, process.env.CHANNEL_ID_REGLAS);
});

client.on("interactionCreate", handleInteraction);

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
