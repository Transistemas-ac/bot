import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  EmbedBuilder,
} from "discord.js";
import fs from "fs";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent, // Necesario para leer el contenido de los mensajes
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const CHANNEL_ID_BIENVENIDA = process.env.CHANNEL_ID_BIENVENIDA;
const CHANNEL_ID_REGLAS = process.env.CHANNEL_ID_REGLAS;
const CHANNEL_ID_PRESENTACION = process.env.CHANNEL_ID_PRESENTACION;
const CHANNEL_ID_ROLES = process.env.CHANNEL_ID_ROLES;
const UNVERIFIED_ROLE_ID = process.env.ROLE_ID_UNVERIFIED;
const VERIFICATION_EMOJI = "✅";

let MESSAGE_ID_ROLES = process.env.MESSAGE_ID_ROLES;
let MESSAGE_ID_REGLAS = process.env.MESSAGE_ID_REGLAS;

const SPAM_WEBHOOK_URL = process.env.SPAM_WEBHOOK_URL; // Webhook para notificaciones de spam
const SPAM_THRESHOLD = 5; // Cantidad de mensajes idénticos para considerar spam
const SPAM_TIME_WINDOW = 30000; // Ventana de tiempo en milisegundos para detectar spam (30 segundos)
const SPAM_KEYWORDS = [
  "nitro",
  "gratis",
  "free",
  "regalo",
  "sorteo",
  "invita",
  "link",
  "discord.gg",
  "phishing",
]; // Palabras clave comunes en mensajes de spam

const recentMessages = new Map(); // Almacena los mensajes recientes para la detección de spam

const ROLES = {
  "💛": process.env.ROLE_ID_ESTUDIANTE,
  "💜": process.env.ROLE_ID_PROFE,
  "❤️": process.env.ROLE_ID_VOLUNTARIE,
  "🧡": process.env.ROLE_ID_COMUNIDAD,
};

// helper para guardar el ID de un mensaje en .env
function saveIdToEnv(key, id) {
  const envPath = ".env";
  let envContent = fs.readFileSync(envPath, "utf8");
  if (!envContent.includes(`${key}=`)) {
    envContent += `\n${key}=${id}\n`;
  } else {
    envContent = envContent.replace(
      new RegExp(`${key}=.*`, "g"),
      `${key}=${id}`
    );
  }
  fs.writeFileSync(envPath, envContent);
  if (key === "MESSAGE_ID_ROLES") MESSAGE_ID_ROLES = id;
  if (key === "MESSAGE_ID_REGLAS") MESSAGE_ID_REGLAS = id;
}

// Mensaje en el canal de roles para que la gente pueda elegir su rol. Si no existe, lo crea y guarda su ID en .env
async function initRoleMessage() {
  const channel = await client.channels
    .fetch(CHANNEL_ID_ROLES)
    .catch(console.error);
  if (!channel?.isTextBased()) return;
  let msg = null;
  if (MESSAGE_ID_ROLES) {
    try {
      msg = await channel.messages.fetch(MESSAGE_ID_ROLES);
    } catch {
      msg = null;
    }
  }
  if (!msg) {
    msg = await channel
      .send({
        embeds: [
          new EmbedBuilder().setTitle("Seleccioná tu rol").setDescription(
            Object.entries(ROLES)
              .map(([emoji, id]) => `${emoji}  –  <@&${id}>`)
              .join("\n")
          ),
        ],
      })
      .catch(console.error);
    if (!msg) return;
    for (const emoji of Object.keys(ROLES)) {
      await msg.react(emoji).catch(console.error);
    }
    saveIdToEnv("MESSAGE_ID_ROLES", msg.id);
    console.log("📄 Mensaje de roles inicializado.");
  } else {
    console.log("📄 Mensaje de roles ya existe.");
  }
}

// Mensaje en el canal de reglas para que la gente reaccione y verifique. Si no existe, lo crea y guarda su ID en .env
async function initRulesMessage() {
  const channel = await client.channels
    .fetch(CHANNEL_ID_REGLAS)
    .catch(console.error);
  if (!channel?.isTextBased()) return;

  if (!MESSAGE_ID_REGLAS) {
    const msg = await channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🚨  REGLAS DEL SERVIDOR 🚨")
            .setDescription(
              `☑️  Invitamos a acualizar tu nick usando tu nombre/apodo y sumando tus pronombres.\n` +
                `☑️  Sentite libre de hablar, debatir, recomendar, preguntar y compartir lo que quieras.\n` +
                `☑️  Los canales están abiertos para que te los apropies y puedas ser parte activa de esta comunidad.\n` +
                `☑️  Invitamos a utilizar la herramienta de spoilers en imágenes y textos con contenido sensible y acompañar con una Advertencia de Contenido acorde. Por ejemplo: "AC: violencia" + texto con spoiler.\n\n` +
                `❌  Actitudes de transodio, homofobia, racismo, capacitismo y cualquier otra forma de discriminación serán motivo de expulsión.\n` +
                `❌  Cualquier forma de acoso u hostigamiento serán motivo de expulsión.\n` +
                `❌  Temas no permitidos: spam y publicidades, cualquier contenido que promueva discursos de odio.\n` +
                `❌  Respetá y validá experiencias de les otres, no insultes ni faltes el respeto a ningune miembre.\n\n` +
                `Sentinte habilitade/a/o a contactarte con algune admin frente a cualquier incomodidad!\n\n` +
                `Al reaccionar con ${VERIFICATION_EMOJI} a este mensaje, confirmás que leíste y aceptás estas reglas. ¡Bienvenide a la comunidad!`
            )
            .setColor("#0099ff"),
        ],
      })
      .catch(console.error);

    if (!msg) return;
    await msg.react(VERIFICATION_EMOJI).catch(console.error);
    saveIdToEnv("MESSAGE_ID_REGLAS", msg.id);
    console.log("📄 Mensajes de reglas e imágenes enviados.");
  } else {
    console.log("📄 Mensaje de reglas ya existe.");
  }
}

client.once(Events.ClientReady, async () => {
  await initRoleMessage();
  await initRulesMessage();
  console.log(`🚀 ${client.user.tag} está en línea!`);
});

// Evento que se dispara cuando un nuevo miembro se une al servidor. Asigna el rol de no verificado y el rol de comunidad directamente cuando se verifica
client.on(Events.GuildMemberAdd, async (member) => {
  // Asignar el rol de no verificado si está configurado
  if (UNVERIFIED_ROLE_ID) {
    const unverifiedRole = member.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
    if (unverifiedRole) {
      await member.roles.add(unverifiedRole).catch(console.error);
      console.log(
        `🔒 ${member.user.tag} se unió y se le asignó el rol no verificado.`
      );
    } else {
      console.log(
        `⚠️ Rol no verificado con ID ${UNVERIFIED_ROLE_ID} no encontrado.`
      );
    }
  } else {
    // Si no hay rol no verificado, asignar el rol de comunidad directamente (comportamiento anterior)
    const comunidadRoleId = ROLES["🧡"];
    if (comunidadRoleId) {
      await member.roles.add(comunidadRoleId).catch(console.error);
    }
  }

  const channel = member.guild.channels.cache.get(CHANNEL_ID_BIENVENIDA);
  if (!channel?.isTextBased()) return;
  await channel
    .send(
      `Hola <@${member.id}>, bienvenide/a/o a Transistemas Comunidad! 🏳️‍⚧️🏳️‍🌈\n
Para obtener acceso completo al servidor, por favor lee las <#${CHANNEL_ID_REGLAS}> y reacciona con ${VERIFICATION_EMOJI} al mensaje de reglas para confirmar que las has leído y aceptado.\n
Una vez verificado, podrás seleccionar tu rol en <#${CHANNEL_ID_ROLES}> y presentarte en <#${CHANNEL_ID_PRESENTACION}>.`
    )
    .catch(console.error);
});

// Evento que se dispara cuando alguien reacciona al mensaje de roles o al mensaje de reglas
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  // Manejo de roles (comportamiento existente)
  if (reaction.message.id === MESSAGE_ID_ROLES) {
    const roleId = ROLES[reaction.emoji.name];
    if (!roleId) return;
    const member = await reaction.message.guild.members
      .fetch(user.id)
      .catch(console.error);
    if (!member) return;
    await member.roles.add(roleId).catch(console.error);
    console.log(`➕ Rol ${reaction.emoji.name} añadido a ${user.tag}.`);
    return; // Salir para no procesar como verificación de reglas
  }

  // Manejo de verificación de reglas
  if (
    reaction.message.id === MESSAGE_ID_REGLAS &&
    reaction.emoji.name === VERIFICATION_EMOJI
  ) {
    const member = await reaction.message.guild.members
      .fetch(user.id)
      .catch(console.error);
    if (!member) return;

    const unverifiedRole = member.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
    const comunidadRole = member.guild.roles.cache.get(ROLES["🧡"]);

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
});

// Evento que se dispara cuando alguien quita una reacción del mensaje de roles o del mensaje de reglas
client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  // Manejo de roles (comportamiento existente)
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
  // No hay un caso de "desverificación" de reglas al quitar la reacción,
  // ya que una vez que se verifica, se asume que el usuario tiene acceso.
});

// Evento que se dispara cuando un mensaje es enviado
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // 1. Detección de spam basado en contenido y repetición
  let isSpamKeyword = SPAM_KEYWORDS.some((keyword) =>
    content.includes(keyword)
  );

  if (!recentMessages.has(content)) {
    recentMessages.set(content, []);
  }

  const messagesByContent = recentMessages.get(content);
  messagesByContent.push({
    author: message.author.id,
    channel: message.channel.id,
    timestamp: Date.now(),
  });

  // Limpiar mensajes antiguos
  recentMessages.set(
    content,
    messagesByContent.filter(
      (msg) => Date.now() - msg.timestamp < SPAM_TIME_WINDOW
    )
  );

  const spamInstances = recentMessages
    .get(content)
    .filter((msg) => Date.now() - msg.timestamp < SPAM_TIME_WINDOW);

  const isRepetitiveSpam = spamInstances.length >= SPAM_THRESHOLD;

  if (isSpamKeyword || isRepetitiveSpam) {
    try {
      await message.delete();
      console.log(
        `🚫 Mensaje de spam detectado y eliminado de ${message.author.tag} en #${message.channel.name}: "${message.content}"`
      );

      // Enviar notificación a un webhook si está configurado
      if (SPAM_WEBHOOK_URL) {
        const embed = new EmbedBuilder()
          .setTitle("🚫 Posible Spam Detectado y Eliminado")
          .setDescription(
            `Un mensaje sospechoso ha sido detectado y eliminado.`
          )
          .setColor("#FF0000")
          .addFields(
            { name: "Usuario", value: `<@${message.author.id}>` },
            { name: "Canal", value: `<#${message.channel.id}>` },
            { name: "Contenido", value: `\`\`\`${message.content}\`\`\`` },
            {
              name: "Razones",
              value: `${isSpamKeyword ? "Palabras clave de spam " : ""}${
                isRepetitiveSpam
                  ? "Mensaje repetitivo en múltiples canales"
                  : ""
              }`,
            }
          )
          .setTimestamp();

        await fetch(SPAM_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ embeds: [embed] }),
        }).catch((err) =>
          console.error("❌ Error al enviar notificación de spam:", err)
        );
      }
    } catch (error) {
      console.error(
        `❌ No se pudo eliminar el mensaje de spam: ${error.message}`
      );
    }
  }
});

client.login(process.env.BOT_TOKEN).catch(() => {
  console.error(
    "❌ Error al iniciar sesión en Discord. ¡Verifica tu BOT_TOKEN!"
  );
});

// Útil para evitar problemas al detener el bot
process.on("SIGINT", () => {
  console.log("👋 Apagando el bot...");
  client.destroy();
  process.exit(0);
});
