import { Module, Global } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { UserModule } from '@/context/user/user.module'
import { ConfigService } from '@bdd-backend/common/dist/domain/config-service'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'
import { CommonModule } from './common.module'
import { SequelizeProvider } from './database.provider'
import { DefaultController } from './rest/default.controller'
import { UserController } from './rest/user.controller'
import { PinoLoggerConfig } from './security/audit-logger.service'

@Global()
@Module({
  imports: [LoggerModule.forRoot(PinoLoggerConfig.getConfig()), CommonModule, UserModule],
  controllers: [UserController, DefaultController],
  providers: [
    {
      provide: ConfigService,
      useClass: ConfigServiceImplement,
    },
    SequelizeProvider,
  ],
  exports: [
    {
      provide: ConfigService,
      useClass: ConfigServiceImplement,
    },
    SequelizeProvider,
  ],
})
export class AppModule {}
