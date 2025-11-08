# ==============================
# 🧪 Comandos de Test (E2E / Deploy)
# ==============================

APP_DIR ?= app                      # Carpeta del proyecto dentro del contenedor
LOCAL_DOCKER_IMAGE ?= my-local-app:latest
DEV_DOCKER_IMAGE ?= my-dev-app:latest

# ----------------------------------------------
# 🚀 Ejecutar pruebas E2E (sin cobertura)
# ----------------------------------------------
##@Global Run E2E tests
## 📘 Uso:
##   make test-e2e
##
## 📘 Ejemplo:
##   make test-e2e
##
## 🔹 Ejecuta las pruebas end-to-end dentro del contenedor Docker
##    usando el script `pnpm test:e2e`. No genera reporte de cobertura.
test-e2e:
	@echo "🧪 Ejecutando pruebas E2E..."
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) \
		pnpm test:e2e


# ----------------------------------------------
# 🧾 Ejecutar pruebas E2E con cobertura
# ----------------------------------------------
##@Global Run E2E tests with coverage
## 📘 Uso:
##   make test-e2e-cov
##
## 📘 Ejemplo:
##   make test-e2e-cov
##
## 🔹 Ejecuta las pruebas end-to-end generando reporte de cobertura.
##    Usa el script `pnpm test:e2e:cov` dentro del contenedor.
test-e2e-cov:
	@echo "🧪 Ejecutando pruebas E2E con cobertura..."
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) \
		pnpm test:e2e:cov


# ----------------------------------------------
# 🚢 Ejecutar pruebas antes del despliegue
# ----------------------------------------------
##@Global Run deploy tests
## 📘 Uso:
##   make test-deploy
##
## 📘 Ejemplo:
##   make test-deploy
##
## 🔹 Ejecuta todas las pruebas en entorno de desarrollo (`DEV_DOCKER_IMAGE`)
##    y monta el directorio `coverage` para guardar los reportes.
test-deploy:
	@echo "🚢 Ejecutando pruebas de despliegue..."
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)/coverage":/$(APP_DIR)/coverage \
		$(DEV_DOCKER_IMAGE) \
		pnpm test
