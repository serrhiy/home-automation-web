#!/bin/sh

build_image="docker.home-automation-web"

if ! docker image inspect "$build_image" > /dev/null 2>&1; then
  echo "Container not found, building..."
  docker build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) --build-arg USERNAME="$USER" -f docker/main/Dockerfile -t "$build_image" .
fi

if [ "$#" -gt 0 ]; then
  docker run --rm --hostname=debian -t -v "$(pwd):/home/$USER/workspace" -w /home/$USER/workspace -u $(id -u):$(id -g) "$build_image" "$@"
else
  docker run --rm --hostname=debian -it -v "$(pwd):/home/$USER/workspace" -w /home/$USER/workspace -u $(id -u):$(id -g) "$build_image"
fi