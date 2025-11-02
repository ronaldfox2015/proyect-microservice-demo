
# Variable por defecto
MODULE_NAME ?= user
BASE_DIR ?= src/context
URL_PATH ?= '/v2/demo/health'
NAME_TEST ?= 'health'
METODO ?= 'GET'

create-module-ddd: ##@Helper create ddd module, make module MODULE_NAME=users
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm run create:module $(BASE_DIR) $(MODULE_NAME)

create-test-e2e: ##@Helper create automated e2e tests, make create-test-e2e URL_PATH=/v2/demo/health NAME_TEST=health METODO=GET
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm run create:test:e2e  $(URL_PATH) $(NAME_TEST) $(METODO)
