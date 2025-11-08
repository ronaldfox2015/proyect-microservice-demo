## CONTAINER VARS ##
USERNAME_LOCAL ?= "$(shell whoami)"
UID_LOCAL      ?= "$(shell id -u)"
GID_LOCAL      ?= "$(shell id -g)"

LOCAL_DOCKER_IMAGE = $(PROJECT_NAME):local
DEV_DOCKER_IMAGE   = $(PROJECT_NAME):dev

CONTAINER_NAME = $(PROJECT_NAME)_backend
PREFIX_PATH = /$(VERSION)/$(SERVICE_NAME)


sync-container-config: ##@Global Sync container enviroment file from S3. make sync-container-config ENV=local ACCOUNT_ENV=dev
	aws s3 sync s3://$(INFRA_BUCKET)/config/container/$(OWNER)/$(ENV)/$(SERVICE_NAME)/ app/ --profile $(ACCOUNT_ENV)

push-container-config: ##@Global Push container enviroment file to S3. make push-container-config ENV=local ACCOUNT_ENV=dev
	aws s3 cp app/.env s3://$(INFRA_BUCKET)/config/container/$(OWNER)/$(ENV)/$(SERVICE_NAME)/.env --profile $(ACCOUNT_ENV)

build-image: ##@Local build docker image, make build-image
	docker build -f docker/local/Dockerfile --no-cache -t $(LOCAL_DOCKER_IMAGE) ./docker

install: ##@Local install dependencies. make install
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm install

up: ##@Local Start docker container. make up
	@DOCKER_IMAGE=$(LOCAL_DOCKER_IMAGE) \
	CONTAINER_NAME=$(CONTAINER_NAME) \
	DOCKER_NETWORK=$(DOCKER_NETWORK) \
	docker compose -p $(SERVICE_NAME) up -d backend

down: ##@Local Destroy the project. make down
	@docker rm -f $(CONTAINER_NAME)

log: ##@Local Show docker container logs. make log
	@docker logs -f $(CONTAINER_NAME)

