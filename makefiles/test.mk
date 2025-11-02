test-e2e: ##@Global Run tests
	docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) \
		pnpm test:e2e

test-e2e-cov: ##@Global Run tests
	docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) \
		pnpm test:e2e:cov

test-deploy: ##@Global Run tests
	docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)/coverage":/$(APP_DIR)/coverage \
		$(DEV_DOCKER_IMAGE) \
		pnpm test
