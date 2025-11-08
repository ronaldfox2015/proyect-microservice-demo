# ===============================================
# 🔐 PRUEBAS DE SEGURIDAD DENTRO DE DOCKER
# Imagen base: proyect-dev-demo:local
# ===============================================

LOCAL_DOCKER_IMAGE = proyect-dev-node-security:20.11-alpine3.18
APP_DIR = /app
ZAP_REPORT = zap-report.html

security: security-audit security-sast
	@echo "✅ Todas las pruebas de seguridad completadas."

# -----------------------------------------------
# 1️⃣ Auditoría de dependencias (SCA)
# -----------------------------------------------
security-audit:
	@echo "🔍 Ejecutando auditoría de dependencias..."
	@docker run --rm -v "$(PWD)/$(APP_DIR)":$(APP_DIR) -w $(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) sh -c "npm audit || true"

# -----------------------------------------------
# 2️⃣ Análisis estático del código (SAST)
# -----------------------------------------------
security-sast:
	@echo "🧠 Ejecutando análisis estático con Semgrep..."
	@docker run --rm -v "$(PWD)/$(APP_DIR)":$(APP_DIR) -w $(APP_DIR) \
		$(LOCAL_DOCKER_IMAGE) sh -c "semgrep --config=auto src/ || true"



