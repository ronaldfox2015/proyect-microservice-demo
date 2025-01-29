import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { INFRASTRUCTURE } from './infrastructure'

@Global()
@Module({
  imports: [HttpModule],
  providers: [...INFRASTRUCTURE],
  exports: [...INFRASTRUCTURE],
})
export class CommonModule {}
