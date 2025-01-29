import { Module } from '@nestjs/common'
import { UserController } from './rest/user.controller'
import { CommonModule } from 'src/context/common/common.module'

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
