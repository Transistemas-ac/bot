import { EmbedBuilder } from "discord.js";
import {
  SPAM_KEYWORDS,
  SPAM_THRESHOLD,
  SPAM_TIME_WINDOW,
  recentMessages,
} from "../constants.js";

export async function onMessageCreate(message) {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  let isSpamKeyword = SPAM_KEYWORDS.some((keyword) =>
    content.includes(keyword)
  );
  if (!recentMessages.has(content)) recentMessages.set(content, []);

  const messagesByContent = recentMessages.get(content);
  messagesByContent.push({
    author: message.author.id,
    channel: message.channel.id,
    timestamp: Date.now(),
  });

  recentMessages.set(
    content,
    messagesByContent.filter(
      (msg) => Date.now() - msg.timestamp < SPAM_TIME_WINDOW
    )
  );

  const spamInstances = recentMessages
    .get(content)
    .filter((msg) => Date.now() - msg.timestamp < SPAM_TIME_WINDOW);
  const isRepetitiveSpam = spamInstances.length >= SPAM_THRESHOLD;

  if (isSpamKeyword || isRepetitiveSpam) {
    try {
      await message.delete();
      console.log(
        `🚫 Mensaje de spam detectado y eliminado de ${message.author.tag} en #${message.channel.name}: "${message.content}"`
      );

      if (process.env.SPAM_WEBHOOK_URL) {
        const embed = new EmbedBuilder()
          .setTitle("🚫 Posible Spam Detectado y Eliminado")
          .setDescription(
            `Un mensaje sospechoso ha sido detectado y eliminado.`
          )
          .setColor("#FF0000")
          .addFields(
            { name: "Usuario", value: `<@${message.author.id}>` },
            { name: "Canal", value: `<#${message.channel.id}>` },
            { name: "Contenido", value: `\`\`\`${message.content}\`\`\`` },
            {
              name: "Razones",
              value: `${isSpamKeyword ? "Palabras clave de spam " : ""}${
                isRepetitiveSpam
                  ? "Mensaje repetitivo en múltiples canales"
                  : ""
              }`,
            }
          )
          .setTimestamp();

        await fetch(process.env.SPAM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [embed] }),
        }).catch((err) =>
          console.error("❌ Error al enviar notificación de spam:", err)
        );
      }
    } catch (error) {
      console.error(
        `❌ No se pudo eliminar el mensaje de spam: ${error.message}`
      );
    }
  }
}
