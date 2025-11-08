import { Module } from '@nestjs/common'
import { APPLICATION_SERVICES } from '@/context/user/application'
import { DOMAIN_SERVICES } from '@/context/user/domain'
import { PROVIDERS } from '@/context/user/infrastructure'

@Module({
  providers: [...APPLICATION_SERVICES, ...PROVIDERS, ...DOMAIN_SERVICES],
  exports: [...APPLICATION_SERVICES, ...PROVIDERS, ...DOMAIN_SERVICES],
})
export class UserModule {}
