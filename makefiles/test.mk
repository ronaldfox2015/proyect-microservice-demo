test: ##@Global Run tests
	docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) \
		pnpm test

test-deploy: ##@Global Run tests
	docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)/coverage":/$(APP_DIR)/coverage \
		$(DEV_DOCKER_IMAGE) \
		pnpm test
