// test/e2e/cucumber.config.ts
import { setDefaultTimeout, BeforeAll, AfterAll } from '@cucumber/cucumber'

setDefaultTimeout(60 * 1000) // 1 minuto

BeforeAll(async () => {
  console.log('🚀 Iniciando pruebas E2E con Cucumber...')
})

AfterAll(async () => {
  console.log('✅ Finalizadas todas las pruebas E2E')
})
