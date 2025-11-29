import { ROLES, VERIFICATION_EMOJI } from "../constants.js";
import { MESSAGE_ID_ROLES, MESSAGE_ID_REGLAS } from "../utils.js";

export async function onMessageReactionAdd(reaction, user) {
  if (user.bot) return;

  if (reaction.message.id === MESSAGE_ID_ROLES) {
    const roleId = ROLES[reaction.emoji.name];
    if (!roleId) return;
    const member = await reaction.message.guild.members
      .fetch(user.id)
      .catch(console.error);
    if (!member) return;
    await member.roles.add(roleId).catch(console.error);
    console.log(`➕ Rol ${reaction.emoji.name} añadido a ${user.tag}.`);
    return;
  }

  if (
    reaction.message.id === MESSAGE_ID_REGLAS &&
    reaction.emoji.name === VERIFICATION_EMOJI
  ) {
    const member = await reaction.message.guild.members
      .fetch(user.id)
      .catch(console.error);
    if (!member) return;
    const unverifiedRole = member.guild.roles.cache.get(
      process.env.ROLE_ID_UNVERIFIED
    );
    const comunidadRole = member.guild.roles.cache.get(ROLES["💜"]);
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
  }
}
