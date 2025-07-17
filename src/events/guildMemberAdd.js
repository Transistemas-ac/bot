export async function onGuildMemberAdd(member) {
  const unverifiedRole = member.guild.roles.cache.get(
    process.env.ROLE_ID_UNVERIFIED
  );
  if (unverifiedRole) {
    await member.roles.add(unverifiedRole).catch(console.error);
    console.log(
      `🔒 ${member.user.tag} se unió y se le asignó el rol no verificado.`
    );
  } else {
    const comunidadRoleId = process.env.ROLE_ID_COMUNIDAD;
    if (comunidadRoleId) {
      await member.roles.add(comunidadRoleId).catch(console.error);
    }
  }

  const channel = member.guild.channels.cache.get(
    process.env.CHANNEL_ID_BIENVENIDA
  );
  if (!channel?.isTextBased()) return;
  await channel
    .send(
      `Hola <@${member.id}>, bienvenide/a/o a Transistemas Comunidad! 🏳️‍⚧️🏳️‍🌈\n\n` +
        `Para obtener acceso completo al servidor, por favor lee las <#${process.env.CHANNEL_ID_REGLAS}> y reacciona con ✅ al mensaje de reglas para confirmar que las has leído y aceptado.\n\n` +
        `Una vez verificado, podrás seleccionar tu rol en <#${process.env.CHANNEL_ID_ROLES}> y presentarte en <#${process.env.CHANNEL_ID_PRESENTACION}>.`
    )
    .catch(console.error);
}
