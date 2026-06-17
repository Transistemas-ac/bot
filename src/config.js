import { Client, GatewayIntentBits, Partials } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  makeCache: (manager) => manager.memoizeData(),
  sweepers: {
    guilds: {
      interval: 300,
      filter: () => true,
    },
    channels: {
      interval: 300,
      filter: () => true,
    },
    roles: {
      interval: 300,
      filter: () => true,
    },
    users: {
      interval: 300,
      filter: () => true,
    },
    messages: {
      interval: 60,
      filter: (m) => m.age > 30,
    },
  },
});
