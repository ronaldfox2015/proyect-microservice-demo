# Comandos de Despliegue y Desarrollo

Este documento describe los diferentes comandos disponibles para gestionar el despliegue y desarrollo del proyecto.

## Deploy

- **build-prod-image**: <span style="color: #d32f2f;">Crea una imagen Docker con solo las dependencias de producción.</span>
- **migrate-deploy**: <span style="color: #d32f2f;">Ejecuta las migraciones.</span>
- **container-deploy-run**: <span style="color: #d32f2f;">Ejecuta los comandos del contenedor de despliegue.</span>
- **deploy-ecs**: <span style="color: #d32f2f;">Despliega actualizando el servicio en ECS.</span>

## Global

- **sync-container-config**: <span style="color: #424242;">Sincroniza el archivo de entorno del contenedor desde S3.</span>
- **push-container-config**: <span style="color: #424242;">Sube el archivo de entorno del contenedor a S3.</span>
- **build**: <span style="color: #424242;">Construye la imagen Docker.</span>
- **command**: <span style="color: #424242;">Instala dependencias. Uso: `make command PACKAGED=""`</span>
- **install**: <span style="color: #424242;">Instala dependencias.</span>
- **ssh**: <span style="color: #424242;">Instala dependencias.</span>
- **build-dev-image**: <span style="color: #424242;">Crea una imagen Docker con las dependencias de desarrollo.</span>
- **lint**: <span style="color: #424242;">Instala dependencias.</span>
- **format**: <span style="color: #424242;">Instala dependencias.</span>
- **create-migration**: <span style="color: #424242;">Crea una migración. Uso: `make create-migration MIGRATION=create-santander-lead-table`</span>
- **create-seed**: <span style="color: #424242;">Crea un seed. Uso: `make create-migration MIGRATION=create-santander-lead-table`</span>
- **migrate**: <span style="color: #424242;">Ejecuta las migraciones.</span>
- **migrate-rollback**: <span style="color: #424242;">Deshace la última migración ejecutada.</span>
- **container-run**: <span style="color: #424242;">Ejecuta un comando en el contenedor. Uso: `make container-run COMMAND=sequelize...`</span>
- **test**: <span style="color: #424242;">Ejecuta las pruebas.</span>
- **test-deploy**: <span style="color: #424242;">Ejecuta las pruebas antes del despliegue.</span>

## Local

- **up**: <span style="color: #d32f2f;">Inicia el contenedor Docker.</span>
- **down**: <span style="color: #d32f2f;">Destruye el proyecto.</span>
- **log**: <span style="color: #d32f2f;">Muestra los logs del contenedor Docker.</span>
- **hooks-app**: <span style="color: #d32f2f;">Ejecuta los hooks del proyecto.</span>

## DDD (Domain-Driven Design)

- **create-module**: <span style="color: #d32f2f;">Crea un nuevo módulo. Uso: `make create-module MODULE_NAME=advertisement`</span>
- **create-orm-module**: <span style="color: #d32f2f;">Crea un módulo ORM. Uso: `make create-orm-module MODULE_NAME=advertisement ORM=mysql2`</span>
