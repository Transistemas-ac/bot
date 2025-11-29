import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const inviteCommand = {
  data: new SlashCommandBuilder()
    .setName("invitar")
    .setDescription("Genera una URL temporal para estudiantes.")
    .addIntegerOption((option) =>
      option
        .setName("dias")
        .setDescription("Cantidad de días de validez")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(31)
    ),

  async execute(interaction) {
    const adminRoleId = process.env.ROLE_ID_ADMIN;
    const member = interaction.member;

    // Validación de permisos
    if (!member || !member.roles || !member.roles.cache.has(adminRoleId)) {
      await interaction.reply({
        content: "❌ Solo admins pueden usar este comando.",
        flags: 64, // ephemeral
      });
      return;
    }

    const days = interaction.options.getInteger("dias");

    // Si NO especificó días, mostrar botones
    if (!days) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("invite_1")
          .setLabel("1 día")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("invite_7")
          .setLabel("1 semana")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("invite_14")
          .setLabel("2 semanas")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("invite_30")
          .setLabel("1 mes")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        content: "Elegí por cuánto tiempo querés que la URL sea válida:",
        components: [row],
        flags: 64, // ephemeral
      });

      return;
    }

    // Si especificó días, hacer defer porque haremos fetch
    await interaction.deferReply({ flags: 64 });

    try {
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
        content: `✅ URL generada (válida ${label}):\n\n${inviteUrl}\n\n`,
        components: [row],
      });
    } catch (error) {
      console.error("❌ Error ejecutando /invitar:", error);
      await interaction.editReply("❌ Hubo un error al ejecutar este comando.");
    }
  },
};
