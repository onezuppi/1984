#!/bin/sh

HTTPS_CONF="/etc/nginx/conf.d/https.conf"
TEMPLATE="/etc/nginx/conf.d/https.conf.template"
CERT="/certs/server.crt"
KEY="/certs/server.key"

if [ -f "$CERT" ] && [ -f "$KEY" ]; then
  echo "[nginx entrypoint] SSL certs found, enabling HTTPS"
  cp "$TEMPLATE" "$HTTPS_CONF"
else
  echo "[nginx entrypoint] No SSL certs found, HTTPS disabled"
fi

nginx -g 'daemon off;'
