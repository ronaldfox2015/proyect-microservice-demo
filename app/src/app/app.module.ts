import { Module, Global } from '@nestjs/common'
import { UserController } from './rest/user.controller'
import { SequelizeProvider } from './database.provider'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'
import { UserModule } from '@/context/user/user.module'
import { LoggerModule } from 'nestjs-pino'
import { CommonModule } from '@/context/common/common.module'
import { PinoLoggerConfig } from './security/audit-logger.service'

@Global()
@Module({
  imports: [LoggerModule.forRoot(PinoLoggerConfig.getConfig()), CommonModule, UserModule],
  controllers: [UserController],
  providers: [ConfigServiceImplement, SequelizeProvider],
  exports: [SequelizeProvider],
})
export class AppModule {}
