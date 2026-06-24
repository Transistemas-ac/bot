# 🐱 Transistemas Bot

Este bot de Discord está diseñado para automatizar y mejorar la gestión de nuestra comunidad, ofreciendo herramientas para la auto-asignación de roles, la moderación de contenido y más.

<br>

## ✨ Funcionalidades

Este bot ofrece una serie de características clave para mantener nuestra comunidad organizada y segura:

- **💬 Hablar**: El bot responde con el mensaje enviado al usar el comando `/talk`.

- **🏓 Ping Pong**: Al usar el comando `/ping` el bot responde con `pong`.

- **🎭 Auto-Asignación de Roles**: En el canal de roles (`#roles`), los miembros pueden seleccionar y asignarse roles de pronombres y habilidades por sí mismos reaccionando a los mensajes interactivos, lo que permite una personalización rápida y sencilla de su perfil.

- **🚫 Detección y Eliminación de Spam**: Identifica y elimina mensajes idénticos enviados en un corto período de tiempo por un mismo usuarie en múltiples canales.

- **🔗 Generación de invitaciones personalizadas**: El comando `/invitar`, disponible únicamente para admins, envía una petición a <a href="https://github.com/Transistemas-ac/ds-invite">un worker interno</a> que devuelve una URL de invitación al servidor.

<br>

## 🚀 Cómo correr el bot

Seguí estos pasos para desplegar y ejecutar el bot:

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Transistemas-ac/bot/
cd bot
```

<br>

### 2️⃣ Instalar Dependencias

Asegurate de tener **Node.js** instalado. Luego, instala las dependencias del proyecto:

```bash
npm install
```

<br>

### 3️⃣ Crear el archivo `.env`

Para que el bot funcione correctamente, necesitas configurar las siguientes variables en un archivo `.env` en la raíz de tu proyecto:

```env
# Token del bot de Discord
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxx

# IDs de los canales de Discord
CHANNEL_ID_REGLAS=879811698284970007
CHANNEL_ID_PRESENTACION=879811698284970011
CHANNEL_ID_ROLES=880415430001438761
CHANNEL_ID_ADMINS=1420142741144338442

# IDs de los roles para auto-asignación
ROLE_ID_ESTUDIANTE=879812347504521256
ROLE_ID_PROFE=880114875743993916
ROLE_ID_VOLUNTARIE=880425513607376967
ROLE_ID_COMUNIDAD=1393349591390355626

# IDs de mensajes persistentes (se guardan automáticamente la primera vez que el bot los crea)
MESSAGE_ID_ROLES_PRONOMBRES=1448434010446495845
MESSAGE_ID_ROLES_HABILIDADES=1448434020202582118
MESSAGE_ID_REGLAS=1448428921241604116

```

<br>

### 4️⃣ Ejecutar el Bot

Una vez configurado todo, iniciá el bot:

```bash
npm start
```

<br>

### <a href="https://discord.com/oauth2/authorize?client_id=1392696789810810941&permissions=334745152&integration_type=0&scope=bot+applications.commands">5️⃣ Agregar al server</a>

<br>

## ☁️ Mantener online

El bot dejara de estar online en el momento que cierres la consola.
Para mantener el bot online en el server 24/7 ⏰ es recomendable desplegarlo en plataformas como Railway o Render. Estas opciones aseguran que el bot se reinicie automáticamente si falla y lo mantienen accesible sin necesidad de tener tu computadora encendida.
Opciones más avanzadas incluyen servicios cloud o self-hosting. Para estos casos es recomendable usar Docker y pm2.

<br>

---

🌈 Creado con orgullo por el Equipo de Desarrollo de Transistemas ♥
