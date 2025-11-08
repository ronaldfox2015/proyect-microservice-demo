# ================================
# 📚 DOCUMENTACIÓN AUTOMÁTICA
# ================================

up-document: ##@Local Start docker container. make up-document
	@DOCKER_IMAGE=proyect-dev-node-document:20.11-alpine3.18 \
	CONTAINER_NAME=$(CONTAINER_NAME)-document \
	DOCKER_NETWORK=$(DOCKER_NETWORK) \
	docker compose -p $(SERVICE_NAME) up -d document

down-document: ##@Local Destroy the project. make down-document
	@docker rm -f $(CONTAINER_NAME)-document

log-document: ##@Local Show docker container logs. make log-document
	@docker logs -f $(CONTAINER_NAME)-document
