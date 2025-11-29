async function generateInvite(days, interaction) {
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
}

module.exports = {
  name: "inviteButtons",

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const id = interaction.customId;

    if (id.startsWith("invite_")) {
      const days = parseInt(id.split("_")[1], 10);
      await generateInvite(days, interaction);
    }
  },
};
