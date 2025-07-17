import { ROLES } from "../constants.js";
import { MESSAGE_ID_ROLES } from "../utils.js";

export async function onMessageReactionRemove(reaction, user) {
  if (user.bot) return;
  if (reaction.message.id === MESSAGE_ID_ROLES) {
    const roleId = ROLES[reaction.emoji.name];
    if (!roleId) return;
    const member = await reaction.message.guild.members
      .fetch(user.id)
      .catch(console.error);
    if (!member) return;
    await member.roles.remove(roleId).catch(console.error);
    console.log(`➖ Rol ${reaction.emoji.name} removido de ${user.tag}.`);
  }
}
