import type { Sequelize } from 'sequelize-typescript'
import { UserRepository } from '@/context/user/domain/repositories/user.repository'
import { UserRepositoryImpl } from './persistence/repositories/user.repository.impl'

export const UserProvider = {
  provide: UserRepository,
  useFactory: async (sequelize: Sequelize) => new UserRepositoryImpl(sequelize),
  inject: ['Sequelize'],
}

export const PROVIDERS = [UserProvider]
