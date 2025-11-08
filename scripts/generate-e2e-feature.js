#!/usr/bin/env node
/**
 * Script: generate-e2e-feature.js
 * Descripción: genera automáticamente archivos E2E (feature + steps)
 * Uso: node generate-e2e-feature.js <url> <feature> <method>
 * Ejemplo: node generate-e2e-feature.js /user user POST
 */

const fs = require('fs');
const path = require('path');

// 🎨 Colores para la consola
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const [, , urlArg, featureArg, methodArg] = process.argv;

// 🔎 Validación general
function validateInputs(url, feature, method) {
  const errors = [];

  if (!url || !feature || !method) {
    errors.push(
      `${COLORS.red}❌ Uso incorrecto:\n  ${COLORS.reset}node generate-e2e-feature.js <url> <feature> <method>\nEjemplo: node generate-e2e-feature.js /user user POST`
    );
  }

  // Validar URL
  if (url && !url.startsWith('/')) {
    errors.push(`${COLORS.red}❌ La URL debe comenzar con una barra (/). Ejemplo: /user${COLORS.reset}`);
  }

  // Validar nombre del feature
  const featureRegex = /^[a-z][a-z0-9_-]*$/;
  if (feature && !featureRegex.test(feature)) {
    errors.push(`${COLORS.red}❌ El nombre del feature solo puede contener letras minúsculas, números, guiones o guiones bajos.${COLORS.reset}`);
  }

  // Validar método
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (method && !validMethods.includes(method.toUpperCase())) {
    errors.push(`${COLORS.red}❌ Método inválido.${COLORS.reset} Debe ser uno de: ${validMethods.join(', ')}`);
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
}

// 📁 Crear directorios si no existen
function ensureDirectories(baseDir) {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const featureDir = path.join(baseDir, 'features');
  const stepDir = path.join(baseDir, 'steps');
  const worldDir = path.join(baseDir, 'world');

  [featureDir, stepDir, worldDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`${COLORS.cyan}📁 Creado:${COLORS.reset} ${dir}`);
    }
  });

  return { featureDir, stepDir, worldDir };
}

// 🧩 Generar contenido dinámico
function generateFeatureAndSteps(url, feature, method) {
  const methodUpper = method.toUpperCase();
  const methodLower = method.toLowerCase();

  let scenarioTitle = '';
  let stepAction = '';
  let responseCode = 200;

  switch (methodUpper) {
    case 'POST':
      scenarioTitle = `Crear un nuevo ${feature} exitosamente`;
      stepAction = `When envío una solicitud POST a "${url}" con los datos del ${feature}`;
      responseCode = 201;
      break;
    case 'GET':
      scenarioTitle = `Obtener lista de ${feature}s`;
      stepAction = `When envío una solicitud GET a "${url}"`;
      responseCode = 200;
      break;
    case 'PUT':
      scenarioTitle = `Actualizar un ${feature} existente`;
      stepAction = `When envío una solicitud PUT a "${url}/1" con los nuevos datos del ${feature}`;
      responseCode = 200;
      break;
    case 'DELETE':
      scenarioTitle = `Eliminar un ${feature} existente`;
      stepAction = `When envío una solicitud DELETE a "${url}/1"`;
      responseCode = 200;
      break;
  }

  const featureContent = `Feature: Gestión de ${feature}s
  Como cliente del API
  Quiero poder realizar operaciones ${methodUpper} sobre ${feature}s
  Para verificar que el endpoint funcione correctamente

  Scenario: ${scenarioTitle}
    Given la aplicación está inicializada
    ${stepAction}
    Then debería recibir un código de estado ${responseCode}
`;

  const stepContent = `import { Given, When, Then, After } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../world/custom-world';

Given('la aplicación está inicializada', async function (this: CustomWorld) {
  await this.initApp();
});

When('envío una solicitud ${methodUpper} a {string}${methodUpper === 'POST' || methodUpper === 'PUT' ? ` con los datos del ${feature}` : ''}', async function (this: CustomWorld, path: string) {
  const req = await this.request();
  ${
    methodUpper === 'POST' || methodUpper === 'PUT'
      ? `const data = { name: '${feature} demo', description: 'Generado automáticamente' };
  this.response = await req.${methodLower}(path).send(data);`
      : `this.response = await req.${methodLower}(path);`
  }
});

Then('debería recibir un código de estado {int}', function (this: CustomWorld, statusCode: number) {
  if (!this.response) {
    throw new Error('❌ No hay respuesta disponible. Asegúrate de enviar una solicitud antes de verificar el estado.');
  }
  assert.strictEqual(this.response.status, statusCode);
});

After(async function (this: CustomWorld) {
  await this.closeApp();
});
`;

  return { featureContent, stepContent };
}

// 🧱 Crear archivos en disco
function writeFiles(featureDir, stepDir, feature, featureContent, stepContent) {
  const featureFile = path.join(featureDir, `${feature}.feature`);
  const stepFile = path.join(stepDir, `${feature}.steps.ts`);

  if (!fs.existsSync(featureFile)) {
    fs.writeFileSync(featureFile, featureContent);
    console.log(`${COLORS.green}🧩 Creado feature:${COLORS.reset} ${featureFile}`);
  } else {
    console.log(`${COLORS.yellow}⚠️ Ya existe:${COLORS.reset} ${featureFile}`);
  }

  if (!fs.existsSync(stepFile)) {
    fs.writeFileSync(stepFile, stepContent);
    console.log(`${COLORS.green}🧩 Creado steps:${COLORS.reset} ${stepFile}`);
  } else {
    console.log(`${COLORS.yellow}⚠️ Ya existe:${COLORS.reset} ${stepFile}`);
  }
}

// 🚀 Ejecución principal
(function main() {
  validateInputs(urlArg, featureArg, methodArg);

  const baseDir = path.join('test', 'e2e');
  const { featureDir, stepDir } = ensureDirectories(baseDir);

  const { featureContent, stepContent } = generateFeatureAndSteps(urlArg, featureArg, methodArg);

  writeFiles(featureDir, stepDir, featureArg, featureContent, stepContent);

  console.log(`\n${COLORS.green}✅ Archivos generados correctamente para el método ${methodArg.toUpperCase()}.${COLORS.reset}`);
})();
