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
    deleted: false,
    notified: false,
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
    let deletedCount = 0;

    for (const msgData of userSpamInstances) {
      if (msgData.deleted) continue;

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
        msgData.deleted = true;
        deletedCount++;
      } catch (err) {
        failedDeletions.push({
          channel: msgData.channel,
          messageId: msgData.messageId,
          error: err.message,
        });
      }
    }

    const alreadyNotified = userSpamInstances.some((m) => m.notified === true);

    if (!alreadyNotified && deletedCount > 0 && process.env.CHANNEL_ID_ADMINS) {
      try {
        const adminChannel = await message.client.channels.fetch(
          process.env.CHANNEL_ID_ADMINS
        );
        if (adminChannel && adminChannel.isTextBased()) {
          await adminChannel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("🚫 Ataque de spam detectado")
                .setColor("#FF0000")
                .addFields(
                  { name: "User", value: `@${message.author.tag}` },
                  {
                    name: "Cantidad de mensajes detectados",
                    value: `${userSpamInstances.length}`,
                  },
                  { name: "Eliminados", value: `${deletedCount}` },
                  {
                    name: "Contenido repetido",
                    value: `\`\`\`${message.content}\`\`\``,
                  }
                )
                .setTimestamp(),
            ],
          });
        }
      } catch (err) {
        console.error(
          "❌ No se pudo notificar al canal de admins:",
          err.message
        );
      }
      for (const msgData of userSpamInstances) {
        msgData.notified = true;
      }
    }

    if (failedDeletions.length === 0) {
      console.log(
        `🚫 Mensajes de spam detectados y eliminados de ${message.author.tag}: "${message.content}"`
      );
    } else {
      console.log(
        `🚫 Spam detectado de ${message.author.tag}. Se eliminaron ${deletedCount} mensajes, ${failedDeletions.length} no se pudieron eliminar.`
      );
      for (const fail of failedDeletions) {
        console.warn(
          `⚠️ No se pudo eliminar mensaje (${fail.messageId}) en canal (${fail.channel}): ${fail.error}`
        );
      }
    }
  }
}
