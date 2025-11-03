import { commandsMap } from "../commands/index.js";

export async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return;

  const command = commandsMap.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Comando no encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error ejecutando ${interaction.commandName}:`, error);

    const errorMessage = {
      content: "❌ Hubo un error al ejecutar este comando.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
}
