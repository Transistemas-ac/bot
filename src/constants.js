export const VERIFICATION_EMOJI = "✅";
export const SPAM_THRESHOLD = 3;
export const SPAM_TIME_WINDOW = 30000;
export const recentMessages = new Map();

export const ROLES_GENERALES = {
  "💜": process.env.ROLE_ID_COMUNIDAD,
  "💛": process.env.ROLE_ID_ESTUDIANTE,
  "🧡": process.env.ROLE_ID_EGRESADE,
};

export const ROLES_PRONOMBRES = {
  "🩷": process.env.ROLE_ID_ELLA,
  "💙": process.env.ROLE_ID_EL,
  "💜": process.env.ROLE_ID_ELLE,
};

//Máximo 20 roles por limitación de Discord en reacciones por mensaje
export const ROLES_HABILIDADES = {
  "💻": process.env.ROLE_ID_FRONTEND,
  "🖥️": process.env.ROLE_ID_BACKEND,
  "📱": process.env.ROLE_ID_MOBILE,
  "🧪": process.env.ROLE_ID_TESTING,
  "🎨": process.env.ROLE_ID_DISENIO,
  "✨": process.env.ROLE_ID_UXUI,
  "📣": process.env.ROLE_ID_COMUNICACION,
  "📁": process.env.ROLE_ID_BD,
  "🎮": process.env.ROLE_ID_GAMEDEV,
  "☁️": process.env.ROLE_ID_CLOUD,
  "🛠️": process.env.ROLE_ID_SYSADMIN,
  "🤖": process.env.ROLE_ID_DATASCIENCE,
  "🛡️": process.env.ROLE_ID_CIBERSEGURIDAD,
  "🧰": process.env.ROLE_ID_SOPORTE_IT,
  "⚖️": process.env.ROLE_ID_DERECHO,
  "🩺": process.env.ROLE_ID_MEDICINA,
  "🧠": process.env.ROLE_ID_PSICOLOGIA,
  "🤝": process.env.ROLE_ID_TRABAJO_SOCIAL,
  "📚": process.env.ROLE_ID_EDUCACION,
  "🎭": process.env.ROLE_ID_ARTE,
};
