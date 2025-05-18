#!/bin/bash

case "$1" in
  dev)
    docker-compose --profile dev up --build
    ;;
  prod)
    docker-compose --profile prod up --build
    ;;
  down)
    docker-compose down
    ;;
  *)
    echo "Usage: ./docker.sh [dev|prod|down]"
    echo "  dev  - Start development environment"
    echo "  prod - Start production environment"
    echo "  down - Stop all containers"
    ;;
esac