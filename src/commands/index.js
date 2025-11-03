import { pingCommand } from "./ping.js";
import { talkCommand } from "./talk.js";

export const commands = [pingCommand, talkCommand];

export const commandsMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));
