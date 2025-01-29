import { ConfigService } from '../domain/config-service'
import { ConfigServiceImplement } from './services/config.service.implement'

export const CONFIGURATION_PROVIDER = {
  provide: ConfigService,
  useClass: ConfigServiceImplement,
}

export const INFRASTRUCTURE = [CONFIGURATION_PROVIDER]
