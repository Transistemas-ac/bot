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

    if (!member.roles.cache.has(adminRoleId)) {
      await interaction.reply({
        content: "❌ Solo admins pueden usar este comando.",
        ephemeral: true,
      });
      return;
    }

    const days = interaction.options.getInteger("dias");

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
        ephemeral: true,
      });

      return;
    }

    const ttlSeconds = days * 24 * 60 * 60;
    let response;

    try {
      response = await fetch(
        `https://ds.transistemas.org/hash?ttl=${ttlSeconds}`
      );
    } catch {
      await interaction.reply({
        content: "Error al contactar el servicio.",
        ephemeral: true,
      });
      return;
    }

    if (!response.ok) {
      await interaction.reply({
        content: "El servicio respondió con un error.",
        ephemeral: true,
      });
      return;
    }

    const body = await response.json();
    if (!body.token) {
      await interaction.reply({
        content: "No pude generar el hash.",
        ephemeral: true,
      });
      return;
    }

    const inviteUrl = `https://ds.transistemas.org/?token=${encodeURIComponent(
      body.token
    )}`;
    const label = days === 1 ? "1 día" : `${days} días`;

    await interaction.reply({
      content: `URL generada (válida ${label}):\n${inviteUrl}`,
      ephemeral: true,
    });
  },
};
