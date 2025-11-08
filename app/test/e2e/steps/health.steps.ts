import assert from 'assert'
import { Given, When, Then, After } from '@cucumber/cucumber'
import type { CustomWorld } from '../world/custom-world'

Given('la aplicación está inicializada', async function (this: CustomWorld) {
  await this.initApp()
})

When('envío una solicitud GET a {string}', async function (this: CustomWorld, path: string) {
  const req = await this.request()
  this.response = await req.get(path)
})

Then('debería recibir un código de estado {int}', function (this: CustomWorld, statusCode: number) {
  if (!this.response) {
    throw new Error(
      '❌ No hay respuesta disponible. Asegúrate de enviar una solicitud antes de verificar el estado.',
    )
  }
  assert.strictEqual(this.response.status, statusCode)
})

After(async function (this: CustomWorld) {
  await this.closeApp()
})
