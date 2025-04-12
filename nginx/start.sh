#!/bin/sh

CERT="/certs/server.crt"
KEY="/certs/server.key"
CONF_DIR="/etc/nginx/conf.d"
HTTP_CONF="$CONF_DIR/http.conf"
HTTP_DISABLED="$CONF_DIR/http.conf.disabled"
HTTPS_TEMPLATE="$CONF_DIR/https.conf.template"
HTTPS_CONF="$CONF_DIR/https.conf"

echo "[entrypoint] Checking for SSL certificates..."

if [ -f "$CERT" ] && [ -f "$KEY" ]; then
  echo "[entrypoint] ✅ SSL certificates found — enabling HTTPS"

  # Копируем HTTPS конфиг, если не существует
  if [ ! -f "$HTTPS_CONF" ]; then
    cp "$HTTPS_TEMPLATE" "$HTTPS_CONF"
    echo "[entrypoint] 🔐 https.conf создан"
  fi

  # Отключаем http.conf, если он активен
  if [ -f "$HTTP_CONF" ]; then
    mv "$HTTP_CONF" "$HTTP_DISABLED"
    echo "[entrypoint] 🚫 http.conf отключён"
  fi
else
  echo "[entrypoint] ⚠️ SSL certificates not found — fallback to HTTP"

  # Удаляем https.conf, если он есть
  if [ -f "$HTTPS_CONF" ]; then
    rm "$HTTPS_CONF"
    echo "[entrypoint] 🧹 https.conf удалён"
  fi

  # Восстанавливаем http.conf, если был отключён
  if [ -f "$HTTP_DISABLED" ]; then
    mv "$HTTP_DISABLED" "$HTTP_CONF"
    echo "[entrypoint] ✅ http.conf восстановлен"
  fi
fi

echo "[entrypoint] 🚀 Starting nginx..."
nginx -g 'daemon off;'
