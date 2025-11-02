import { Sequelize } from 'sequelize-typescript'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'

export const SequelizeProvider = {
  provide: 'Sequelize',
  useFactory: async (config: ConfigServiceImplement) => {
    return new Sequelize(config.get('DB_NAME'), config.get('DB_INVITED_USERNAME'), config.get('DB_INVITED_PASSWORD'), {
      host: config.get('DB_HOST'),
      port: Number(config.get('DB_PORT')),
      dialect: 'mysql',
      logging: Boolean(Number(config.get('DB_LOGGING'))),
      timezone: '-05:00',
      define: {
        timestamps: false,
      },
    })
  },
  inject: [ConfigServiceImplement],
}
