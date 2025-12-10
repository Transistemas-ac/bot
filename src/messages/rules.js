import { EmbedBuilder } from "discord.js";
import { saveIdToEnv, MESSAGE_ID_REGLAS } from "../utils/saveIdToEnv.js";
import { VERIFICATION_EMOJI } from "../constants.js";

export async function initRulesMessage(client, channelId) {
  const channel = await client.channels.fetch(channelId).catch(console.error);
  if (!channel?.isTextBased()) return;

  if (!MESSAGE_ID_REGLAS) {
    const msg = await channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🚨  REGLAS DEL SERVIDOR 🚨")
            .setDescription(
              `☑️  Invitamos a elegir tus pronombres y habilidades en el canal de <#${process.env.CHANNEL_ID_ROLES}>.\n` +
                `☑️  Sentite libre de hablar, debatir, recomendar, preguntar y compartir lo que quieras.\n` +
                `☑️  Los canales están abiertos para que te los apropies y puedas ser parte activa de esta comunidad.\n` +
                `☑️  Invitamos a utilizar la herramienta de spoilers en imágenes y textos con contenido sensible y acompañar con una Advertencia de Contenido acorde. Por ejemplo: "AC: violencia + texto/imagen con spoiler".\n\n` +
                `❌  Actitudes de transodio, homofobia, racismo, capacitismo y cualquier otra forma de discriminación serán motivo de expulsión.\n` +
                `❌  Cualquier forma de acoso u hostigamiento serán motivo de expulsión.\n` +
                `❌  Temas no permitidos: spam y publicidades, cualquier contenido que promueva discursos de odio.\n` +
                `❌  Respetá y validá experiencias de les otres, no insultes ni faltes el respeto a ningune miembre.\n\n` +
                `Sentinte habilitade/a/o a contactarte con algune admin frente a cualquier incomodidad!\n\n` +
                `Al reaccionar con ${VERIFICATION_EMOJI} a este mensaje, confirmás que leíste y aceptás estas reglas. ¡Bienvenide a la comunidad!`
            )
            .setColor("#0099ff"),
        ],
      })
      .catch(console.error);

    if (!msg) return;
    await msg.react(VERIFICATION_EMOJI).catch(console.error);
    saveIdToEnv("MESSAGE_ID_REGLAS", msg.id);
    console.log("📄 Mensajes de reglas e imágenes enviados.");
  } else {
    console.log("✅ Mensaje de reglas ya existe.");
  }
}
