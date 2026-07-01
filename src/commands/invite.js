import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
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
    const member = interaction.member;
    const isAdmin =
      member?.permissions?.has(PermissionsBitField.Flags.Administrator) ||
      (process.env.ROLE_ID_ADMIN &&
        member?.roles?.cache?.has(process.env.ROLE_ID_ADMIN));

    if (!isAdmin) {
      await interaction.reply({
        content: "❌ Solo admins pueden usar este comando.",
        flags: 64,
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

      await interaction.editReply({
        content: `✅ URL generada (válida por ${label}):\n\`\`\`${inviteUrl}\`\`\``,
      });
    } catch (error) {
      console.error("❌ Error ejecutando /invitar:", error);
      await interaction.editReply("❌ Hubo un error al ejecutar este comando.");
    }
  },
};
