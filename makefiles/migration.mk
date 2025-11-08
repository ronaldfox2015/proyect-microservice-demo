# ================================
# ⚙️ VARIABLES GLOBALES
# ================================

# Nombre de la migración o seed por defecto (puede ser sobrescrito al ejecutar)
# Ejemplo: make create-migration MIGRATION=create-santander-lead-table
MIGRATION ?= create-user-table

# Rutas de configuración
SEQUELIZE_CONFIG = src/database/config/sequelize-cli-config.js
MIGRATIONS_PATH = src/database/migrations
SEEDERS_PATH = src/database/seeders

# Configuración de contenedor Docker
WORKDIR = /$(APP_DIR)
DOCKER_RUN = docker container run --workdir "$(WORKDIR)" --rm -i \
	-v "$(PWD)/$(APP_DIR)":$(WORKDIR) \
	--network=$(DOCKER_NETWORK) \
	$(LOCAL_DOCKER_IMAGE)

# Base commandos
PNPM_CONTAINER = $(DOCKER_RUN) pnpm

create-database: ##@Migrate Crea la base de datos. make create-database
	$(PNPM_CONTAINER) exec sequelize-cli db:create \
		--config $(SEQUELIZE_CONFIG)

# ================================
# 🏗️ COMANDOS DISPONIBLES
# ================================

##----------------------------------------
## 📦 Crear una nueva migración
##----------------------------------------
## Ejemplo de uso:
##   make create-migration MIGRATION=create-user-table
##
## Genera un archivo en: src/database/migrations/
create-migration: ##@Migrate Crea una nueva migración, make create-migration MIGRATION=create-user-table
	$(PNPM_CONTAINER) exec sequelize-cli migration:generate \
		--name $(MIGRATION) \
		--config $(SEQUELIZE_CONFIG) \
		--migrations-path $(MIGRATIONS_PATH)


##----------------------------------------
## 🌱 Crear un nuevo seeder
##----------------------------------------
## Ejemplo de uso:
##   make create-seed MIGRATION=seed-user-data
##
## Genera un archivo en: src/database/seeders/
create-seed: ##@Migrate Crea un nuevo seeder, make create-seed MIGRATION=seed-user-data
	$(PNPM_CONTAINER) exec sequelize-cli seed:generate \
		--name $(MIGRATION) \
		--config $(SEQUELIZE_CONFIG) \
		--seeders-path $(SEEDERS_PATH)


##----------------------------------------
## 🚀 Ejecutar todas las migraciones y seeders
##----------------------------------------
## Ejemplo de uso:
##   make migrate
##
## Aplica todas las migraciones pendientes y ejecuta los seeders.
migrate: ##@Migrate Ejecuta migraciones y seeders, make migrate
	$(PNPM_CONTAINER) exec sequelize-cli db:migrate \
		--config $(SEQUELIZE_CONFIG) \
		--migrations-path $(MIGRATIONS_PATH)
	$(PNPM_CONTAINER) exec sequelize-cli db:seed:all \
		--config $(SEQUELIZE_CONFIG) \
		--seeders-path $(SEEDERS_PATH)


##----------------------------------------
## 🔄 Revertir la última migración y seeders
##----------------------------------------
## Ejemplo de uso:
##   make migrate-rollback
##
## Revierte la última migración y elimina los datos generados por los seeders.
migrate-rollback: ##@Migrate Revierte la última migración y seeders, make migrate-rollback
	$(PNPM_CONTAINER) exec sequelize-cli db:migrate:undo \
		--config $(SEQUELIZE_CONFIG) \
		--migrations-path $(MIGRATIONS_PATH)
	$(PNPM_CONTAINER) exec sequelize-cli db:seed:undo:all \
		--config $(SEQUELIZE_CONFIG) \
		--seeders-path $(SEEDERS_PATH)


