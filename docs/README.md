# 📚 Documentación de Comandos Make

## 📂 main

## 📂 container

### `make sync-container-config`

Sync container enviroment file from S3. make sync-container-config ENV=local ACCOUNT_ENV=dev

### `make push-container-config`

Push container enviroment file to S3. make push-container-config ENV=local ACCOUNT_ENV=dev

### `make build-image`

build docker image, make build-image

### `make install`

install dependencies. make install

### `make up`

Start docker container. make up

### `make down`

Destroy the project. make down

### `make log`

Show docker container logs. make log

## 📂 deploy

### `make sync-deploy-config`

Deploy Sync deploy files from S3

### `make build-dev-image`

Create a Docker image with the dev dependencies packaged

### `make build-prod-image`

Create a Docker image with only prod dependencies packaged

### `make migrate-deploy`

Run migrations

### `make container-deploy-run`

Run deploy container commands

### `make login-aws`

Deploy Login to AWS

### `make deploy-ecs`

Deploy updating the service

## 📂 document

### `make generate-docs`

Genera documentación README.md para todos los comandos en un solo archivo

### `make clean-docs`

Elimina toda la documentación generada

### `make list-commands`

Lista todos los comandos disponibles con sus descripciones

## 📂 help

## 📂 helper

### `make create-module-ddd`

create ddd module. make create-module-ddd MODULE_NAME=users

### `make create-test-e2e`

create automated e2e tests

### `make format`

install dependencies. make format

### `make command`

install dependencies. make command COMMAND=""

## 📂 migration

### `make create-database`

Crea la base de datos. make create-database

### `make create-migration`

Crea una nueva migración, make create-migration MIGRATION=create-user-table

### `make create-seed`

Crea un nuevo seeder, make create-seed MIGRATION=seed-user-data

### `make migrate`

Ejecuta migraciones y seeders, make migrate

### `make migrate-rollback`

Revierte la última migración y seeders, make migrate-rollback

## 📂 test

## 📂 main

## 📂 main

