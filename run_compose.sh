#!/bin/sh

./gen_certs.sh

export USER=$(whoami)
export GID=$(id -g)
export UID=$(id -u)

docker compose up