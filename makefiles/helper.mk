# ==============================
# 🔧 Variables por defecto
# ==============================
MODULE_NAME ?= user               # Nombre del módulo a crear (ejemplo: user, product, order)
BASE_DIR ?= src/context           # Ruta base donde se crean los módulos
URL_PATH ?= '/v2/demo/health'     # Ruta del endpoint para pruebas E2E
NAME_TEST ?= 'health'             # Nombre del test E2E
METODO ?= 'GET'                   # Método HTTP para la prueba E2E
LOCAL_DOCKER_IMAGE ?= my-local-app:latest  # Imagen Docker local
APP_DIR ?= app                    # Carpeta del proyecto dentro del contenedor


# ==============================
# 🧩 Helper: Crear módulo DDD
# ==============================
##@Helper create ddd module
## 📘 Uso:
##   make create-module-ddd MODULE_NAME=users
##
## 📘 Ejemplo:
##   make create-module-ddd MODULE_NAME=vehicle
##
## 🔹 Ejecuta `pnpm run create:module` dentro del contenedor Docker
##    para generar un nuevo módulo siguiendo la arquitectura DDD
##    (Domain-Driven Design) en la ruta definida en `BASE_DIR`.
create-module-ddd: ##@Helper create ddd module. make create-module-ddd MODULE_NAME=users
	@echo "🚀 Creando módulo DDD: $(MODULE_NAME)"
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		-v "$(PWD)/scripts":/scripts \
		${LOCAL_DOCKER_IMAGE} \
		pnpm run create:module $(BASE_DIR) $(MODULE_NAME)



# ==============================
# 🧪 Helper: Crear test E2E
# ==============================
##@Helper create automated e2e tests
## 📘 Uso:
##   make create-test-e2e URL_PATH=/v2/demo/health NAME_TEST=health METODO=GET
##
## 📘 Ejemplo:
##   make create-test-e2e URL_PATH=/v2/users NAME_TEST=user METODO=POST
##
## 🔹 Ejecuta `pnpm run create:test:e2e` dentro del contenedor Docker
##    para generar un test automatizado end-to-end (Cucumber + Jest)
##    basado en la URL, nombre y método HTTP proporcionados.
create-test-e2e: ##@Helper create automated e2e tests
	@echo "🧪 Creando test E2E: $(NAME_TEST) [$(METODO) $(URL_PATH)]"
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		-v "$(PWD)/scripts":/scripts \
		${LOCAL_DOCKER_IMAGE} \
		pnpm run create:test:e2e $(URL_PATH) $(NAME_TEST) $(METODO)


# ==============================
# 🧰 Global: Sesión interactiva en el contenedor
# ==============================
##@Global open interactive shell inside container
## 📘 Uso:
##   make ssh
##
## 📘 Ejemplo:
##   make ssh
##
## 🔹 Abre una sesión interactiva (`sh`) dentro del contenedor Docker
##    para ejecutar comandos manualmente en el entorno del proyecto.
ssh:
	@echo "🔧 Abriendo shell interactiva en el contenedor..."
	@docker container run --workdir "/$(APP_DIR)" --rm -it \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		sh


# ==============================
# 🪝 Local: Instalar hooks de Git
# ==============================
##@Local hooks the project
## 📘 Uso:
##   make hooks-app
##
## 📘 Ejemplo:
##   make hooks-app
##
## 🔹 Copia los hooks `pre-commit` y `prepare-commit-msg` desde
##    la carpeta `hooks/` a `.git/hooks/` y les da permisos de ejecución.
hooks-app:
	@echo "🪝 Instalando hooks de Git..."
	cp $(PWD)/hooks/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit
	cp $(PWD)/hooks/prepare-commit-msg .git/hooks/ && chmod +x .git/hooks/prepare-commit-msg


# ==============================
# 🧹 Global: Linter y formato de código
# ==============================
##@Global run linter
## 📘 Uso:
##   make lint
##
## 📘 Ejemplo:
##   make lint
##
## 🔹 Ejecuta el linter definido en el proyecto (por ejemplo, ESLint o Biome)
##    para analizar y validar la calidad del código fuente.
lint:
	@echo "🧹 Ejecutando linter..."
	make command COMMAND="lint"


##@Global run code formatter
## 📘 Uso:
##   make format
##
## 📘 Ejemplo:
##   make format
##
## 🔹 Aplica formato automático al código fuente siguiendo
##    las reglas del proyecto (Prettier o Biome, según corresponda).
format:##@Global install dependencies. make format
	@echo "🎨 Formateando código..."
	make command COMMAND="lint:format"

command: ##@Global install dependencies. make command COMMAND=""
	@docker container run --workdir "/$(APP_DIR)" --rm -i \
		-v "$(PWD)/$(APP_DIR)":/$(APP_DIR) \
		${LOCAL_DOCKER_IMAGE} \
		pnpm $(COMMAND)

