import type { INestApplication } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'
import type { IWorldOptions } from '@cucumber/cucumber'
import { setWorldConstructor, World } from '@cucumber/cucumber'
import request from 'supertest'
import { AllExceptionFilter } from '@/app/filter/exception.filter'
import { AppModule } from '../../../src/app/app.module'

export class CustomWorld extends World {
  app: INestApplication | null = null
  moduleFixture: TestingModule | null = null
  client: ReturnType<typeof request> | null = null
  response: request.Response | null = null
  baseUrl: string // 🌍 Nueva propiedad

  constructor(options: IWorldOptions) {
    super(options)

    this.baseUrl =
      process.env.E2E_BASE_URL || (options.parameters?.baseUrl as string) || 'http://localhost:3000'
  }

  async initApp(): Promise<void> {
    if (this.app || this.baseUrl !== 'http://localhost:3000') {
      return
    }

    this.moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    this.app = this.moduleFixture.createNestApplication()
    this.app.useGlobalFilters(new AllExceptionFilter())
    const config: any = this.app.get(ConfigServiceImplement)
    const name: string = config.get('APP_NAME')
    const version: string = config.get('APP_VERSION')
    this.app.setGlobalPrefix(`v${version}/${name}`)
    this.app.listen(3000)
    await this.app.init()

    this.client = request(this.app.getHttpServer())
    console.log('✅ NestJS App inicializada para escenario')
  }

  // 🧪 Devuelve el cliente Supertest para ejecutar requests
  request(): ReturnType<typeof request> {
    if (this.client) {
      return this.client // Usa la app interna
    }

    // 🌍 Si hay URL externa, usa request apuntando a esa base
    return request(this.baseUrl)
  }

  // 🧹 Cierra la aplicación NestJS después del escenario
  async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close()
      this.app = null
      this.client = null
      console.log('🧹 NestJS App cerrada correctamente')
    }
  }
}

// Registrar el “World” personalizado en Cucumber
setWorldConstructor(CustomWorld)
