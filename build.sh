#!/bin/sh

USER=root
REMOTE_HOST=vps.jeremymeadows.dev
IDENTITY_KEY=~/.ssh/vps
APP_ROOT=/srv/sites/soulstone_builds

name=$(npm pkg get name | tr -d '"')
version=$(npm pkg get version | tr -d '"')

bun --bun run vite build
docker build -t $name:$version --network host .
docker image tag $name:$version $name:latest
docker image save $name:$version -o ${name}-$version.tar

if [ "$1" = "--run" ]; then
  docker compose down
  docker compose up -d
fi

if [ "$1" = "--deploy" ]; then
  scp -i $IDENTITY_KEY docker-compose.yaml $USER@$REMOTE_HOST:$APP_ROOT
  ssh -i $IDENTITY_KEY $USER@$REMOTE_HOST "docker image load" < ${name}-$version.tar
  ssh -i $IDENTITY_KEY $USER@$REMOTE_HOST << END
    cd $APP_ROOT
    touch db.sqlite

    docker image tag $name:$version $name:latest

    docker compose down
    docker compose up -d
END

  echo "Deployed $name:$version to $REMOTE_HOST."
fi