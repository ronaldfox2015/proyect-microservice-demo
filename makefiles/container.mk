## CONTAINER VARS ##
USERNAME_LOCAL ?= "$(shell whoami)"
UID_LOCAL      ?= "$(shell id -u)"
GID_LOCAL      ?= "$(shell id -g)"

LOCAL_DOCKER_IMAGE = $(PROJECT_NAME):local
DEV_DOCKER_IMAGE   = $(PROJECT_NAME):dev

CONTAINER_NAME = $(PROJECT_NAME)_backend
PREFIX_PATH = /$(VERSION)/$(SERVICE_NAME)



sync-container-config: ##@Global Sync container enviroment file from S3
	aws s3 sync s3://$(INFRA_BUCKET)/config/container/$(OWNER)/$(ENV)/$(SERVICE_NAME)/ app/ --profile $(ACCOUNT_ENV)

push-container-config: ##@Global Push container enviroment file to S3
	aws s3 cp app/.env s3://$(INFRA_BUCKET)/config/container/$(OWNER)/$(ENV)/$(SERVICE_NAME)/.env --profile $(ACCOUNT_ENV)

build-image: ##@Global build docker image, make build-image
	docker build -f docker/local/Dockerfile --no-cache -t $(LOCAL_DOCKER_IMAGE) ./docker

command: ##@Global install dependencies. make command PACKAGED=""
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm $(PACKAGED)

install: ##@Global install dependencies. make install
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm install

up: ##@Local Start docker container
	@DOCKER_IMAGE=$(LOCAL_DOCKER_IMAGE) \
	CONTAINER_NAME=$(CONTAINER_NAME) \
	DOCKER_NETWORK=$(DOCKER_NETWORK) \
	docker compose -p $(SERVICE_NAME) up -d backend

down: ##@Local Destroy the project
	@docker rm -f $(CONTAINER_NAME)

log: ##@Local Show docker container logs
	@docker logs -f $(CONTAINER_NAME)

ssh: ##@Global install dependencies
	docker container run --workdir "/$(APP_DIR)" --rm -it \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		sh

build-dev-image: ##@Global Create a Docker image with the dev dependencies packaged
  @docker build -f docker/dev/Dockerfile -t $(DEV_DOCKER_IMAGE) .

hooks-app: ##@Local hooks the project
	cp $(PWD)/hooks/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit
	cp $(PWD)/hooks/prepare-commit-msg .git/hooks/ && chmod +x .git/hooks/prepare-commit-msg

lint: ##@Global install dependencies
	make container-run COMMAND="lint"

format: ##@Global install dependencies
	make container-run COMMAND="lint:format"

create-migration: ##@Global Create migration make create-migration MIGRATION=create-santander-lead-table
	make container-run COMMAND="sequelize migration:generate --name $(MIGRATION)"

create-seed: ##@Global Create migration make create-migration MIGRATION=create-santander-lead-table
	make container-run COMMAND="sequelize seed:generate --name $(MIGRATION)"

migrate: ##@Global Run migrations
	make container-run COMMAND="sequelize db:create"
	make container-run COMMAND="sequelize db:migrate"
	make container-run COMMAND="sequelize db:seed:all"

migrate-rollback: ##@Global Undo migration
	make container-run COMMAND="sequelize db:migrate:undo"

container-run: ##@Global Run container command make container-run COMMAND=sequelize...
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		--network=$(DOCKER_NETWORK) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm $(COMMAND)
