import { Sequelize } from 'sequelize-typescript'
import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'
import { UserModel } from '../../context/user/infrastructure/persistence/models/user.model'

const config = new ConfigServiceImplement()
export const databaseConfig = new Sequelize({
  dialect: 'mysql',
  host: config.get('DB_HOST') || 'localhost',
  username: config.get('DB_USER') || 'root',
  password: config.get('DB_PASS') || '',
  database: config.get('DB_NAME') || 'app_db',
  port: Number(config.get('DB_PORT')) || 3306,
  logging: false,
  models: [UserModel],
  dialectOptions: {
    ssl: {
      require: true, // 🔒 Fuerza el uso de TLS
      rejectUnauthorized: true, // 🔐 Evita certificados no válidos
    },
  },
})
