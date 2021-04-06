#!/bin/bash
if [ $# -lt 1 ]
then
  echo "Caminho do arquivo de variaveis de ambiente não encontrado:"
  echo "Ex: ./start.sh .env.dev"
  exit
fi


# docker-compose -f ./docker-compose.yml -f ./api/docker-compose.yml --env-file="$1" config > docker-compose.all.yml
FILE=$1 docker-compose -f ./docker-compose.template.yml --env-file="$1" config > docker-compose.yml
docker-compose up --build -d 
