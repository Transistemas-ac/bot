# 🤖 Discord Bot

¡Bienvenide al repositorio del bot oficial de **Transistemas Comunidad**! Este bot de Discord está diseñado para automatizar y mejorar la gestión de nuestra comunidad, ofreciendo herramientas para la bienvenida de nueves miembres, la auto-asignación de roles y la moderación de contenido.

---

## ✨ Funcionalidades Destacadas

Este bot ofrece una serie de características clave para mantener nuestra comunidad organizada y segura:

- **👋 Bienvenida Automatizada**: Al unirse un nuevo miembro, el bot lo saluda automáticamente en el canal de bienvenida (`#bienvenida`), proporcionándole instrucciones claras sobre cómo obtener acceso completo al servidor.

- **🔒 Sistema de Verificación de Reglas**: Los nuevos usuarios deben leer y aceptar las reglas del servidor reaccionando a un mensaje específico en el canal de reglas (`#reglas`). Hasta que lo hagan, se les asigna un rol de "no verificade" (`unverified`) con acceso limitado.

- **🎭 Auto-Asignación de Roles**: En el canal de roles (`#roles`), los miembros pueden seleccionar y asignarse roles por sí mismos reaccionando a un mensaje interactivo, lo que permite una personalización rápida y sencilla de su perfil.

- **🚫 Detección y Eliminación de Spam**:
  - **Filtrado por Palabras Clave**: Monitorea los mensajes en busca de palabras clave de spam configurables (ej. "nitro", "gratis", "link").
  - **Detección de Mensajes Repetitivos**: Identifica y elimina mensajes idénticos enviados en un corto período de tiempo por diferentes usuarios o en múltiples canales.
  - **Notificaciones de Spam (Webhook)**: Si se configura, envía alertas a un webhook específico cada vez que se detecta y elimina un mensaje de spam, facilitando la moderación.

<br></br>

## 🚀 Cómo correr el bot

Seguí estos pasos para desplegar y ejecutar el bot:

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Transistemas-ac/discord-bot/
cd discord-bot
```

### 2️⃣ Instalar Dependencias

Asegurate de tener **Node.js** instalado. Luego, instala las dependencias del proyecto:

```bash
npm install
```

### 3️⃣ Crear el archivo `.env`

Para que el bot funcione correctamente, necesitas configurar las siguientes variables en un archivo `.env` en la raíz de tu proyecto:

```env
# Token de tu bot de Discord (¡Mantener secreto!)
BOT_TOKEN=TU_BOT_TOKEN_AQUI

# IDs de los canales de Discord
CHANNEL_ID_BIENVENIDA=ID_DEL_CANAL_DE_BIENVENIDA
CHANNEL_ID_REGLAS=ID_DEL_CANAL_DE_REGLAS
CHANNEL_ID_PRESENTACION=ID_DEL_CANAL_DE_PRESENTACION
CHANNEL_ID_ROLES=ID_DEL_CANAL_DE_ROLES

# ID del rol que se asigna a los usuarios no verificados (si aplica)
ROLE_ID_UNVERIFIED=ID_DEL_ROL_NO_VERIFICADO

# IDs de los roles para auto-asignación
ROLE_ID_ESTUDIANTE=ID_DEL_ROL_ESTUDIANTE
ROLE_ID_PROFE=ID_DEL_ROL_PROFE
ROLE_ID_VOLUNTARIE=ID_DEL_ROL_VOLUNTARIE
ROLE_ID_COMUNIDAD=ID_DEL_ROL_COMUNIDAD

# Webhook para notificaciones de spam (opcional, pero recomendado)
SPAM_WEBHOOK_URL=TU_WEBHOOK_URL_PARA_SPAM

# IDs de mensajes persistentes (se guardan automáticamente la primera vez que el bot los crea)
# No necesitas establecer estos valores manualmente al inicio, el bot los generará.
MESSAGE_ID_ROLES=
MESSAGE_ID_REGLAS=

```

### 4️⃣ Ejecutar el Bot

Una vez configurado todo, iniciá el bot:

```bash
npm start
```

### 5️⃣ Mantener online

Para mantener el bot online en el server hay que hacer deploy a algún servicio, por ejemplo Railway.

---

<br>
Creado con orgullo por el Equipo de Desarrollo de Transistemas
