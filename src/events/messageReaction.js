import {
  ROLES_PRONOMBRES,
  ROLES_HABILIDADES,
  VERIFICATION_EMOJI,
} from "../constants.js";
import {
  MESSAGE_ID_ROLES_PRONOMBRES,
  MESSAGE_ID_ROLES_HABILIDADES,
  MESSAGE_ID_REGLAS,
} from "../utils/saveIdToEnv.js";

async function handleReaction(reaction, user, isAdding) {
  if (user.bot) return;

  const member = await reaction.message.guild.members
    .fetch(user.id)
    .catch(console.error);
  if (!member) return;

  // Manejo de roles por emojis
  if (reaction.message.id === MESSAGE_ID_ROLES_PRONOMBRES) {
    const roleId = ROLES_PRONOMBRES[reaction.emoji.name];
    if (!roleId) return;

    if (isAdding) {
      await member.roles.add(roleId).catch(console.error);
      console.log(`➕ Rol ${reaction.emoji.name} añadido a ${user.tag}.`);
    } else {
      await member.roles.remove(roleId).catch(console.error);
      console.log(`➖ Rol ${reaction.emoji.name} removido de ${user.tag}.`);
    }
    return;
  }

  if (reaction.message.id === MESSAGE_ID_ROLES_HABILIDADES) {
    const roleId = ROLES_HABILIDADES[reaction.emoji.name];
    if (!roleId) return;

    if (isAdding) {
      await member.roles.add(roleId).catch(console.error);
      console.log(
        `➕ Rol ${reaction.emoji.name} ${roleId} añadido a ${user.tag}.`
      );
    } else {
      await member.roles.remove(roleId).catch(console.error);
      console.log(
        `➖ Rol ${reaction.emoji.name} ${roleId} removido de ${user.tag}.`
      );
    }
    return;
  }

  // Manejo de verificación de reglas
  if (
    reaction.message.id === MESSAGE_ID_REGLAS &&
    reaction.emoji.name === VERIFICATION_EMOJI
  ) {
    const unverifiedRole = member.guild.roles.cache.get(
      process.env.ROLE_ID_UNVERIFIED
    );
    const comunidadRole = member.guild.roles.cache.get(
      ROLES_PRONOMBRES["💜"] || ROLES_HABILIDADES["💜"]
    );

    if (isAdding) {
      // Añadir reacción: quitar "sin verificar" y añadir "comunidad"
      if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
        await member.roles.remove(unverifiedRole).catch(console.error);
        console.log(`🔓 Rol no verificado removido de ${user.tag}.`);
      }
      if (comunidadRole && !member.roles.cache.has(comunidadRole.id)) {
        await member.roles.add(comunidadRole).catch(console.error);
        console.log(
          `✅ Rol de comunidad añadido a ${user.tag} por verificación de reglas.`
        );
      }
    } else {
      // Quitar reacción: quitar "comunidad" y añadir "sin verificar"
      if (comunidadRole && member.roles.cache.has(comunidadRole.id)) {
        await member.roles.remove(comunidadRole).catch(console.error);
        console.log(`❌ Rol de comunidad removido de ${user.tag}.`);
      }
      if (unverifiedRole && !member.roles.cache.has(unverifiedRole.id)) {
        await member.roles.add(unverifiedRole).catch(console.error);
        console.log(`🔒 Rol sin verificar añadido de nuevo a ${user.tag}.`);
      }
    }
  }
}

export async function onMessageReactionAdd(reaction, user) {
  await handleReaction(reaction, user, true);
}

export async function onMessageReactionRemove(reaction, user) {
  await handleReaction(reaction, user, false);
}
