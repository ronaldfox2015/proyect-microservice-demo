import { ConfigServiceImplement } from '@bdd-backend/common/dist/infrastructure/services/config.service.implement'
const config = new ConfigServiceImplement()

export const jwtConstants = {
  secret: config.get('JWT_SECRET'),
  expiresIn: '1h',
  algorithm: 'HS512',
}
