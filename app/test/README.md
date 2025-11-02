# 🧪 generate-e2e-feature.js

Script CLI en **Node.js** para generar automáticamente **tests E2E (End-to-End)** basados en **Cucumber + Supertest + NestJS**.

Permite crear rápidamente los archivos `.feature` y `.steps.ts` necesarios para probar endpoints REST (`GET`, `POST`, `PUT`, `DELETE`) con un solo comando.

---

## 🚀 Características

✅ Genera automáticamente:
- Archivo `.feature` (definición Gherkin)
- Archivo `.steps.ts` (implementación de pasos)
- Estructura base `/test/e2e/features`, `/steps`, `/world`

✅ Validaciones incluidas:
- Verifica parámetros de entrada (URL, nombre del feature y método HTTP)
- Crea directorios si no existen
- Evita sobrescribir archivos existentes
- Colores en consola para mejor legibilidad

---

## 📦 Instalación

```bash
pnpm add cucumber @cucumber/cucumber supertest @types/supertest assert --save-dev
```

Coloca el archivo `generate-e2e-feature.js` en la raíz del proyecto y asegúrate de darle permisos de ejecución:

```bash
chmod +x generate-e2e-feature.js
```

---

## 🧩 Uso

```bash
node generate-e2e-feature.js <url> <feature> <method>
```

### Ejemplo:

```bash
node generate-e2e-feature.js /user user POST
```

### Resultado:

Crea automáticamente:

```
test/e2e/
├── features/
│   └── user.feature
├── steps/
│   └── user.steps.ts
└── world/
```

---

## 🧠 Validaciones

| Parámetro | Descripción | Reglas |
|------------|--------------|--------|
| `<url>` | Ruta del endpoint | Debe comenzar con `/` |
| `<feature>` | Nombre del módulo o recurso | Solo minúsculas, números, `-` o `_` |
| `<method>` | Método HTTP | Uno de: `GET`, `POST`, `PUT`, `DELETE` |

Ejemplo válido:
```bash
node generate-e2e-feature.js /advertisement advertisement GET
```

Ejemplo inválido:
```bash
node generate-e2e-feature.js advertisement Advertisement PATCH
# ❌ URL inválida y método no soportado
```

---

## 🧱 Estructura generada

Ejemplo con `POST /user`:

### 📄 `test/e2e/features/user.feature`
```gherkin
Feature: Gestión de users
  Como cliente del API
  Quiero poder realizar operaciones POST sobre users
  Para verificar que el endpoint funcione correctamente

  Scenario: Crear un nuevo user exitosamente
    Given la aplicación está inicializada
    When envío una solicitud POST a "/user" con los datos del user
    Then debería recibir un código de estado 201
```

### ⚙️ `test/e2e/steps/user.steps.ts`
```ts
import { Given, When, Then, After } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../world/custom-world';

Given('la aplicación está inicializada', async function (this: CustomWorld) {
  await this.initApp();
});

When('envío una solicitud POST a {string} con los datos del user', async function (this: CustomWorld, path: string) {
  const req = await this.request();
  const data = { name: 'user demo', description: 'Generado automáticamente' };
  this.response = await req.post(path).send(data);
});

Then('debería recibir un código de estado {int}', function (this: CustomWorld, statusCode: number) {
  if (!this.response) throw new Error('❌ No hay respuesta disponible. Asegúrate de enviar una solicitud antes de verificar el estado.');
  assert.strictEqual(this.response.status, statusCode);
});

After(async function (this: CustomWorld) {
  await this.closeApp();
});
```

---

## ⚙️ Integración con Cucumber

Agrega el siguiente script en tu `package.json`:

```json
{
  "scripts": {
    "e2e": "cucumber-js --require-module ts-node/register --require test/e2e/steps/**/*.ts --require test/e2e/world/**/*.ts --format progress"
  }
}
```

Ejecuta tus pruebas con:
```bash
pnpm e2e
```

---

## 🧮 Generación de coverage (para SonarQube)

Para generar cobertura de código con Cucumber + Jest o NYC:

```bash
pnpm add nyc --save-dev
```

Agrega en `package.json`:

```json
{
  "scripts": {
    "e2e:coverage": "nyc --reporter=lcov cucumber-js --require test/e2e/steps/**/*.ts"
  }
}
```

Genera reporte en:
```
coverage/lcov-report/index.html
```

---

## 🧰 Comando como paquete ejecutable (CLI)

Si deseas usarlo como un comando global:

1. Edita `package.json`:

```json
{
  "bin": {
    "gen:e2e": "generate-e2e-feature.js"
  }
}
```

2. Instálalo globalmente:
```bash
pnpm link
```

3. Luego puedes ejecutarlo así:
```bash
gen:e2e /user user POST
```

---

## 🧑‍💻 Autor

**Script desarrollado por:**  
Ronald Cutisaca 🇵🇪  
Basado en NestJS + Cucumber + Supertest

---

## 🧾 Licencia

MIT © 2025
