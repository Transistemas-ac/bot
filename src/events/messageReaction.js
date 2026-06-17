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

  if (reaction.message.id === MESSAGE_ID_ROLES_PRONOMBRES) {
    const roleId = ROLES_PRONOMBRES[reaction.emoji.name];
    if (!roleId) return;

    const role = reaction.message.guild.roles.cache.get(roleId);
    const roleName = role ? role.name : roleId;

    if (isAdding) {
      if (!member.roles.cache.has(roleId)) {
        await member.roles.add(roleId).catch(console.error);
        console.log(
          `➕ Rol ${reaction.emoji.name} ${roleName} añadido a ${user.tag}.`
        );
      }
    } else {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId).catch(console.error);
        console.log(
          `➖ Rol ${reaction.emoji.name} ${roleName} removido de ${user.tag}.`
        );
      }
    }
    return;
  }

  if (reaction.message.id === MESSAGE_ID_ROLES_HABILIDADES) {
    const roleId = ROLES_HABILIDADES[reaction.emoji.name];
    if (!roleId) return;

    const role = reaction.message.guild.roles.cache.get(roleId);
    const roleName = role ? role.name : roleId;

    if (isAdding) {
      if (!member.roles.cache.has(roleId)) {
        await member.roles.add(roleId).catch(console.error);
        console.log(
          `➕ Rol ${reaction.emoji.name} ${roleName} añadido a ${user.tag}.`
        );
      }
    } else {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId).catch(console.error);
        console.log(
          `➖ Rol ${reaction.emoji.name} ${roleName} removido de ${user.tag}.`
        );
      }
    }
    return;
  }

  if (
    reaction.message.id === MESSAGE_ID_REGLAS &&
    reaction.emoji.name === VERIFICATION_EMOJI
  ) {
    return;
  }
}

export async function onMessageReactionAdd(reaction, user) {
  await handleReaction(reaction, user, true);
}

export async function onMessageReactionRemove(reaction, user) {
  await handleReaction(reaction, user, false);
}
