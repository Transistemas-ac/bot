import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

async function generateInvite(days, interaction) {
  const ttlSeconds = days * 24 * 60 * 60;

  let response;
  try {
    response = await fetch(
      `https://ds.transistemas.org/hash?ttl=${ttlSeconds}`
    );
  } catch {
    await interaction.editReply({
      content: "❌ Error al contactar el servicio.",
    });
    return;
  }

  if (!response.ok) {
    await interaction.editReply({
      content: "❌ El servicio respondió con un error.",
    });
    return;
  }

  const body = await response.json();
  if (!body.token) {
    await interaction.editReply({
      content: "❌ No pude generar el hash.",
    });
    return;
  }

  const inviteUrl = `https://ds.transistemas.org/?token=${encodeURIComponent(
    body.token
  )}`;
  const label = days === 1 ? "1 día" : `${days} días`;

  // Botón de copiar
  const copyButton = new ButtonBuilder()
    .setCustomId(`copy_url_${body.token}`)
    .setLabel("📋 Copiar URL")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(copyButton);

  await interaction.editReply({
    content: `✅ URL generada (válida ${label}):\n\n${inviteUrl}`,
    components: [row],
  });
}

export const inviteButtonHandler = {
  name: "inviteButtons",

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const id = interaction.customId;

    // Manejar botón de copiar (respuesta inmediata, sin defer)
    if (id.startsWith("copy_url_")) {
      const token = id.replace("copy_url_", "");
      const inviteUrl = `https://ds.transistemas.org/?token=${encodeURIComponent(
        token
      )}`;

      await interaction.reply({
        content: `📋 URL copiada:\n\`\`\`${inviteUrl}\`\`\`\nSeleccioná el texto de arriba y copialo (Discord no permite copiar automáticamente).`,
        flags: 64, // ephemeral
      });
      return;
    }

    if (!id.startsWith("invite_")) return;

    // Defer porque haremos fetch
    await interaction.deferReply({ flags: 64 });

    const adminRoleId = process.env.ROLE_ID_ADMIN;
    const member = interaction.member;

    // Validación de permisos
    if (!member || !member.roles || !member.roles.cache.has(adminRoleId)) {
      await interaction.editReply({
        content: "❌ Solo admins pueden usar estos botones.",
      });
      return;
    }

    const days = parseInt(id.split("_")[1], 10);
    if (!Number.isFinite(days) || days <= 0) {
      await interaction.editReply({
        content: "❌ El botón no tiene un valor de días válido.",
      });
      return;
    }

    try {
      await generateInvite(days, interaction);
    } catch (error) {
      console.error("❌ Error ejecutando botón invite_*:", error);
      await interaction.editReply({
        content: "❌ Hubo un error al ejecutar este botón.",
      });
    }
  },
};

export default inviteButtonHandler;
