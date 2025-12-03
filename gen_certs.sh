#!/bin/sh
set -e

TARGET_DIR="./certs"
CRT="$TARGET_DIR/localhost.crt"
KEY="$TARGET_DIR/localhost.key"

mkdir -p "$TARGET_DIR"

if [ -f "$CRT" ] || [ -f "$KEY" ]; then
  echo "Certificates already exist, skipping generation."
  exit 0
fi

CONF=$(mktemp)

cat <<EOF > "$CONF"
[dn]
CN=localhost
[req]
distinguished_name = dn
[EXT]
subjectAltName=DNS:localhost,IP:127.0.0.1
keyUsage=digitalSignature
extendedKeyUsage=serverAuth
EOF

openssl req -new -x509 \
  -keyout "$KEY" \
  -out "$CRT" \
  -days 365 \
  -nodes \
  -sha256 \
  -subj "/CN=localhost" \
  -extensions EXT \
  -config "$CONF"

rm "$CONF"

echo " - $CRT"
echo " - $KEY"
