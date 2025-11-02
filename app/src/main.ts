import { GlobalValidationPipe } from './app/pipes/validation.pipe'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AllExceptionFilter } from './app/filter/exception.filter'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'

import { NestExpressApplication } from '@nestjs/platform-express'
// 🛡️ Seguridad
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

export function getErrorMessage(error: any): string | null {
  if (error.constraints) {
    const constraintTypes = Object.keys(error.constraints)
    return error.constraints[constraintTypes[0]]
  } else if (error.children && error.children.length > 0) {
    for (const childError of error.children) {
      const errorMessage = getErrorMessage(childError)
      if (errorMessage) {
        return errorMessage
      }
    }
  }

  return null
}

async function bootstrap() {
  // 🚀 Crear app con soporte CORS
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
  })
  // ✅ Confía en el proxy (necesario si usas Nginx, Cloudflare, etc.)
  app.set('trust proxy', 1)
  // ⚙️ Filtros y validaciones globales
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalPipes(new GlobalValidationPipe())

  // 🛡️ Seguridad: cabeceras seguras y rate limiting
  app.use(helmet())

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Límite por IP
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Demasiadas solicitudes desde esta IP, intenta nuevamente más tarde.',
    }),
  )

  // ⚙️ Configuración dinámica desde ConfigService
  const config: any = app.get(ConfigServiceImplement)
  const name: string = config.get('APP_NAME')
  const version: string = config.get('APP_VERSION')
  const titleDocs: string = config.get('APP_DOCS_TITLE')
  const descriptionDocs: string = config.get('APP_DOCS_DESCRIPTION')
  const isDevelopment = process.env.NODE_ENV === 'development'
  const host: string = config.get('APP_DOMAIN')

  // 🌐 Configuración CORS
  app.enableCors({
    origin: [host],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })

  app.setGlobalPrefix(`v${version}/${name}`)

  // 📘 Swagger configurado
  const options = new DocumentBuilder()
    .setTitle(titleDocs)
    .setDescription(descriptionDocs)
    .setVersion(`${version}.0`)
    .addTag(`v${version}/${name}`)
    .build()
  // 🧩 Logger dinámico
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(`v${version}/${name}/doc`, app, document)

  // 🚀 Iniciar servidor
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
