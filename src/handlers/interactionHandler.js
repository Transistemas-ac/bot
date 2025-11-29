import { commandsMap } from "../commands/index.js";
import { inviteButtonHandler } from "./inviteButtonHandler.js";

export async function handleInteraction(interaction) {
  if (interaction.isButton()) {
    try {
      await inviteButtonHandler.execute(interaction);
    } catch (error) {
      console.error(`❌ Error en button handler:`, error);

      try {
        if (interaction.deferred) {
          await interaction.editReply({
            content: "❌ Hubo un error al procesar este botón.",
          });
        } else if (!interaction.replied) {
          await interaction.reply({
            content: "❌ Hubo un error al procesar este botón.",
            flags: 64,
          });
        }
      } catch (replyError) {
        console.error(
          `❌ No se pudo responder al error del botón:`,
          replyError
        );
      }
    }
    return;
  }

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

    try {
      if (interaction.deferred) {
        await interaction.editReply({
          content: "❌ Hubo un error al ejecutar este comando.",
        });
      } else if (interaction.replied) {
        await interaction.followUp({
          content: "❌ Hubo un error al ejecutar este comando.",
          flags: 64,
        });
      } else {
        await interaction.reply({
          content: "❌ Hubo un error al ejecutar este comando.",
          flags: 64,
        });
      }
    } catch (replyError) {
      console.error(`❌ No se pudo responder al error:`, replyError);
    }
  }
}
