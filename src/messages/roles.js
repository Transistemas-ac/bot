import { EmbedBuilder } from "discord.js";
import {
  saveIdToEnv,
  MESSAGE_ID_ROLES_PRONOMBRES,
  MESSAGE_ID_ROLES_HABILIDADES,
} from "../utils/saveIdToEnv.js";
import { ROLES_PRONOMBRES, ROLES_HABILIDADES } from "../constants.js";

export async function initRoleMessage(client, channelId) {
  const channel = await client.channels.fetch(channelId).catch(console.error);
  if (!channel?.isTextBased()) return;

  let msgPronombres = null;
  if (MESSAGE_ID_ROLES_PRONOMBRES) {
    try {
      msgPronombres = await channel.messages.fetch(MESSAGE_ID_ROLES_PRONOMBRES);
    } catch {
      msgPronombres = null;
    }
  }

  if (!msgPronombres) {
    msgPronombres = await channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Seleccioná tus pronombres")
            .setDescription(
              Object.entries(ROLES_PRONOMBRES)
                .map(([emoji, id]) => `${emoji}  –  <@&${id}>`)
                .join("\n")
            ),
        ],
      })
      .catch(console.error);

    if (!msgPronombres) return;
    for (const emoji of Object.keys(ROLES_PRONOMBRES)) {
      await msgPronombres.react(emoji).catch(console.error);
    }
    saveIdToEnv("MESSAGE_ID_ROLES_PRONOMBRES", msgPronombres.id);
    console.log("📄 Mensaje de roles de pronombres creado.");
  } else {
    console.log("✅ Mensaje de roles de pronombres ya existe.");
  }

  let msgHabilidades = null;
  if (MESSAGE_ID_ROLES_HABILIDADES) {
    try {
      msgHabilidades = await channel.messages.fetch(
        MESSAGE_ID_ROLES_HABILIDADES
      );
    } catch {
      msgHabilidades = null;
    }
  }

  if (!msgHabilidades) {
    msgHabilidades = await channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Seleccioná tus habilidades")
            .setDescription(
              Object.entries(ROLES_HABILIDADES)
                .map(([emoji, id]) => `${emoji}  –  <@&${id}>`)
                .join("\n")
            ),
        ],
      })
      .catch(console.error);

    if (!msgHabilidades) return;
    for (const emoji of Object.keys(ROLES_HABILIDADES)) {
      await msgHabilidades.react(emoji).catch(console.error);
    }
    saveIdToEnv("MESSAGE_ID_ROLES_HABILIDADES", msgHabilidades.id);
    console.log("📄 Mensaje de roles de habilidades creado.");
  } else {
    console.log("✅ Mensaje de roles de habilidades ya existe.");
  }
}
