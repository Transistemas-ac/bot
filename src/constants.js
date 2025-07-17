export const VERIFICATION_EMOJI = "✅";
export const SPAM_THRESHOLD = 5;
export const SPAM_TIME_WINDOW = 30000;
export const SPAM_KEYWORDS = [
  "nitro",
  "gratis",
  "free",
  "regalo",
  "sorteo",
  "invita",
  "link",
  "discord.gg",
  "phishing",
];
export const recentMessages = new Map();
export const ROLES = {
  "💛": process.env.ROLE_ID_ESTUDIANTE,
  "💜": process.env.ROLE_ID_PROFE,
  "❤️": process.env.ROLE_ID_VOLUNTARIE,
  "🧡": process.env.ROLE_ID_COMUNIDAD,
};
