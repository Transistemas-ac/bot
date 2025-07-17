import { Events } from "discord.js";
import { onGuildMemberAdd } from "./guildMemberAdd.js";
import { onMessageCreate } from "./messageCreate.js";
import { onMessageReactionAdd } from "./messageReactionAdd.js";
import { onMessageReactionRemove } from "./messageReactionRemove.js";

export function registerEvents(client) {
  client.on(Events.GuildMemberAdd, onGuildMemberAdd);
  client.on(Events.MessageCreate, onMessageCreate);
  client.on(Events.MessageReactionAdd, onMessageReactionAdd);
  client.on(Events.MessageReactionRemove, onMessageReactionRemove);
}
