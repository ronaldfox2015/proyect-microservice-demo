import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { DotenvExpandOutput } from 'dotenv-expand'
import { type ConfigService } from '../../domain/config-service'

export class ConfigServiceImplement implements ConfigService {
  private readonly envConfig: DotenvExpandOutput

  constructor() {
    this.envConfig = dotenvExpand.expand(dotenv.config({ path: '.env' }))
  }

  public get(key: string): string {
    const env = this.envConfig.parsed
    return env === undefined ? '' : env[key]
  }
}
