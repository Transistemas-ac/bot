import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  EmbedBuilder,
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const ROLE_CHANNEL_ID = process.env.ROLE_CHANNEL_ID;
const REGLAS_CHANNEL_ID = process.env.REGLAS_CHANNEL_ID;
const PRESENTACION_CHANNEL_ID = process.env.PRESENTACION_CHANNEL_ID;
const ROLES_CHANNEL_ID = process.env.ROLES_CHANNEL_ID;
let ROLE_MESSAGE_ID = process.env.ROLE_MESSAGE_ID;

const ROLES = {
  "💛 ": process.env.ROLE_ID_ESTUDIANTE,
  "💜": process.env.ROLE_ID_PROFE,
  "❤️": process.env.ROLE_ID_VOLUNTARIE,
  "🧡": process.env.ROLE_ID_COMUNIDAD,
};

client.once(Events.ClientReady, () => {
  initRoleMessage();
});

client.on(Events.GuildMemberAdd, async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel?.isTextBased()) return;
  await channel.send(
    `Hola <@${member.id}>, bienvenide/a/o a Transistemas Comunidad! 🏳️‍⚧️🏳️‍🌈\n
- Te pedimos que leas <#${REGLAS_CHANNEL_ID}> y reacciones a tu rol como integrante de nuestra comunidad en <#${ROLES_CHANNEL_ID}>.\n
- También podés presentarte en <#${PRESENTACION_CHANNEL_ID}>, personalizar tu apodo y agregar tus pronombres en tu perfil para que estén visibles para toda la comunidad 🌈`
  );
});

async function initRoleMessage() {
  const channel = await client.channels.fetch(ROLE_CHANNEL_ID);
  if (!channel?.isTextBased()) return;
  const messages = await channel.messages.fetch({ limit: 10 });
  let msg = messages.find(
    (m) => m.author.id === client.user.id && m.id === ROLE_MESSAGE_ID
  );
  if (!msg) {
    msg = await channel.send({
      embeds: [
        new EmbedBuilder().setTitle("Selecciona tu rol").setDescription(
          Object.entries(ROLES)
            .map(([e, id]) => `${e} – <@&${id}>`)
            .join("\n")
        ),
      ],
    });
    for (const emoji of Object.keys(ROLES)) await msg.react(emoji);
    ROLE_MESSAGE_ID = msg.id;
  }
}

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot || reaction.message.id !== ROLE_MESSAGE_ID) return;
  const roleId = ROLES[reaction.emoji.name];
  if (!roleId) return;
  const member = await reaction.message.guild.members.fetch(user.id);
  await member.roles.add(roleId);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot || reaction.message.id !== ROLE_MESSAGE_ID) return;
  const roleId = ROLES[reaction.emoji.name];
  if (!roleId) return;
  const member = await reaction.message.guild.members.fetch(user.id);
  await member.roles.remove(roleId);
});

client.login(process.env.BOT_TOKEN);
