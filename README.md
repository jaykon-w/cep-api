# cep-api

- ELK baseado no repo: [deviantony/docker-elk](https://github.com/deviantony/docker-elk)
- Grafana e Prometheus baseado no repo: [stefanprodan/dockprom](https://github.com/stefanprodan/dockprom)

## Subindo o projeto de forma rápida

Caso precise mudar alguma configuração, é possivel criar um novo arquivo de variáveis de ambiente. Depois basta utiliza-lo no comando abaixo:

```shell
./start.sh .env.dev
```

## Executando os testes

```shell
cd api
npm test
```

## Swagger

[Documentação local](https://localhost:3001/docs)

## Kibana

[Kibana local](https://localhost:5601)

user: elastic<br>
password: changeme

## Endpoints não documentados

| Caminho  |           Descrição            |
| :------: | :----------------------------: |
|  /ping   |  Checa de a aplicação esta ok  |
| /version | Verifica a versão da aplicação |
|   /log   |   Testa os logs da aplicação   |
