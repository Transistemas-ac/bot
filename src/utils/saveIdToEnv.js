import fs from "fs";

export let MESSAGE_ID_ROLES_PRONOMBRES =
  process.env.MESSAGE_ID_ROLES_PRONOMBRES;
export let MESSAGE_ID_ROLES_HABILIDADES =
  process.env.MESSAGE_ID_ROLES_HABILIDADES;
export let MESSAGE_ID_REGLAS = process.env.MESSAGE_ID_REGLAS;

export function saveIdToEnv(key, id) {
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
  if (key === "MESSAGE_ID_ROLES_PRONOMBRES") MESSAGE_ID_ROLES_PRONOMBRES = id;
  if (key === "MESSAGE_ID_ROLES_HABILIDADES") MESSAGE_ID_ROLES_HABILIDADES = id;
  if (key === "MESSAGE_ID_REGLAS") MESSAGE_ID_REGLAS = id;
}
