const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
const envPath = path.resolve(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')

const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .filter(Boolean)
    .map(line => line.split('='))
)
// Cargar variables desde .env

module.exports = {
  development: {
    username: envVars.DB_USER_ROOT || 'root',
    password: envVars.DB_PASSWORD_ROOT || null,
    database: envVars.DB_NAME_ROOT || 'my_database',
    host: envVars.DB_HOST_ROOT || '127.0.0.1',
    dialect: envVars.DB_DIALECT_ROOT || 'mysql',
    migrationStorageTableName: 'migrations',
    seederStorageTableName: 'seeders',
    logging: true,
  },
}
