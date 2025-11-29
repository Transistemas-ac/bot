import { pingCommand } from "./ping.js";
import { talkCommand } from "./talk.js";
import { inviteCommand } from "./invite.js";

export const commands = [pingCommand, talkCommand, inviteCommand];

export const commandsMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));
