import { EmbedBuilder } from "discord.js";
import { saveIdToEnv, MESSAGE_ID_ROLES } from "../utils.js";
import { ROLES } from "../constants.js";

export async function initRoleMessage(client, channelId) {
  const channel = await client.channels.fetch(channelId).catch(console.error);
  if (!channel?.isTextBased()) return;

  let msg = null;
  if (MESSAGE_ID_ROLES) {
    try {
      msg = await channel.messages.fetch(MESSAGE_ID_ROLES);
    } catch {
      msg = null;
    }
  }

  if (!msg) {
    msg = await channel
      .send({
        embeds: [
          new EmbedBuilder().setTitle("Seleccioná tu rol").setDescription(
            Object.entries(ROLES)
              .map(([emoji, id]) => `${emoji}  –  <@&${id}>`)
              .join("\n")
          ),
        ],
      })
      .catch(console.error);

    if (!msg) return;
    for (const emoji of Object.keys(ROLES)) {
      await msg.react(emoji).catch(console.error);
    }
    saveIdToEnv("MESSAGE_ID_ROLES", msg.id);
    console.log("📄 Mensaje de roles inicializado.");
  } else {
    console.log("📄 Mensaje de roles ya existe.");
  }
}
