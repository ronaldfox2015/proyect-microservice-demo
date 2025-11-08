import { Module } from '@nestjs/common'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'

@Module({
  providers: [ConfigServiceImplement],
  exports: [ConfigServiceImplement],
})
export class CommonModule {}
