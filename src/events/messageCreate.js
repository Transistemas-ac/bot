import { EmbedBuilder } from "discord.js";
import {
  SPAM_THRESHOLD,
  SPAM_TIME_WINDOW,
  recentMessages,
} from "../constants.js";

export async function onMessageCreate(message) {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  if (!recentMessages.has(content)) recentMessages.set(content, []);

  const messagesByContent = recentMessages.get(content);
  messagesByContent.push({
    author: message.author.id,
    channel: message.channel.id,
    messageId: message.id,
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
  const userSpamInstances = spamInstances.filter(
    (msg) => msg.author === message.author.id
  );
  const isRepetitiveSpam = userSpamInstances.length >= SPAM_THRESHOLD;

  if (isRepetitiveSpam) {
    const failedDeletions = [];

    for (const msgData of userSpamInstances) {
      try {
        const channel = await message.client.channels.fetch(msgData.channel);
        if (!channel) {
          failedDeletions.push({
            channel: msgData.channel,
            messageId: msgData.messageId,
            error: "Canal no encontrado",
          });
          continue;
        }
        const msgToDelete = await channel.messages.fetch(msgData.messageId);
        await msgToDelete.delete();
      } catch (err) {
        failedDeletions.push({
          channel: msgData.channel,
          messageId: msgData.messageId,
          error: err.message,
        });
      }
    }

    if (failedDeletions.length === 0) {
      console.log(
        `🚫 Mensajes de spam detectados y eliminados de ${message.author.tag}: "${message.content}"`
      );
    } else {
      console.log(
        `🚫 Spam detectado de ${message.author.tag}. Se eliminaron ${
          userSpamInstances.length - failedDeletions.length
        } mensajes, ${failedDeletions.length} no se pudieron eliminar.`
      );
      for (const fail of failedDeletions) {
        console.warn(
          `⚠️ No se pudo eliminar mensaje (${fail.messageId}) en canal (${fail.channel}): ${fail.error}`
        );
      }
    }

    if (process.env.SPAM_WEBHOOK_URL) {
      const embed = new EmbedBuilder()
        .setTitle("🚫 Spam Repetido Detectado")
        .setDescription(
          `Se detectaron mensajes iguales del mismo usuario en múltiples canales dentro de la ventana de tiempo.`
        )
        .setColor("#FF0000")
        .addFields(
          { name: "Usuario", value: `<@${message.author.id}>` },
          { name: "Contenido", value: `\`\`\`${message.content}\`\`\`` },
          {
            name: "Eliminados",
            value: `${userSpamInstances.length - failedDeletions.length}`,
          },
          {
            name: "Fallidos",
            value: `${failedDeletions.length}`,
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
  }
}
