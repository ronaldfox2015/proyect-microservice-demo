create-module: ##@ddd Uso: make create-module MODULE_NAME=advertisement
	@echo "Creando la estructura del módulo DDD para TypeScript..."
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/domain/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/domain/services/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/domain/repositories/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/domain/value-objects/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/application/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/application/commands/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/application/queries/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/application/services/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/infrastructure/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/infrastructure/orm/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/infrastructure/repositories/
	@mkdir -p $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/infrastructure/service-integration/
	@echo "// $(MODULE_NAME) module entry point" > $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/application/index.ts
	@echo "// $(MODULE_NAME) module entry point" > $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/infrastructure/index.ts
	@echo "// $(MODULE_NAME) module entry point" > $(PWD)/$(APP_DIR)/src/context/$(MODULE_NAME)/$(MODULE_NAME).module.ts
	@echo "Módulo $(MODULE_NAME) creado exitosamente."

create-orm-module: ##@ddd Uso: make create-orm-module MODULE_NAME=advertisement ORM=mysql2
	@echo "Creando la estructura del orm en el modulo DDD para TypeScript..."
	@make command PACKAGED="add sequelize sequelize-typescript @nestjs/sequelize"
	@make command PACKAGED="add -D @types/sequelize"
	@make create-library-orm

