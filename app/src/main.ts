import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from './context/common/domain/config-service'
import { AllExceptionFilter } from './app/filter/exception.filter'

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
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new AllExceptionFilter())
  const config: any = app.get(ConfigService)
  const name: string = config.get('APP_NAME')
  const version: string = config.get('APP_VERSION')
  const titleDocs: string = config.get('APP_DOCS_TITLE')
  const descriptionDocs: string = config.get('APP_DOCS_DESCRIPTION')
  app.setGlobalPrefix(`v${version}/${name}`)

  const options = new DocumentBuilder()
    .setTitle(titleDocs)
    .setDescription(descriptionDocs)
    .setVersion(`${version}.0`)
    .addTag(`v${version}/${name}`)
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(`v${version}/${name}/doc`, app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
