#!/usr/bin/env bash
# Setup único del VPS: crea un bare repo receptor de pushes y un working
# tree asociado, e instala el hook post-receive de auto-deploy.
#
# Requisitos: git y el plugin docker compose ya instalados (ver README).
# Asume el layout por defecto ~/bot.git + ~/bot. Si usás otro nombre/ruta,
# editá las variables REPO_NAME y REPO_DIR abajo.

set -euo pipefail

REPO_NAME="bot"
REPO_DIR="$HOME/${REPO_NAME}.git"
WORK_TREE="$HOME/${REPO_NAME}"

if [ -d "$REPO_DIR" ]; then
  echo "❌ $REPO_DIR ya existe. Si querés reinstalar, borralo primero." >&2
  exit 1
fi

echo "==> Creando bare repo en $REPO_DIR"
git init --bare "$REPO_DIR"

echo "==> Clonando working tree en $WORK_TREE"
git clone "$REPO_DIR" "$WORK_TREE"

echo "==> Instalando hook post-receive"
mkdir -p "$REPO_DIR/hooks"
cp "$WORK_TREE/deploy/post-receive" "$REPO_DIR/hooks/post-receive"
chmod +x "$REPO_DIR/hooks/post-receive"

cat <<EOF

✅ Listo. Próximos pasos en el VPS:

  1. cd $WORK_TREE
  2. cp compose.example.env .env  # y editar con los valores reales
  3. docker compose up -d --build   # deploy inicial

Después, en tu PC, agregá el remote y pusheá:

  git remote add vps usuario@IP:$REPO_DIR
  git push vps main
EOF
