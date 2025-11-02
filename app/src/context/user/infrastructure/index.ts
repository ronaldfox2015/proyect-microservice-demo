import { Sequelize } from 'sequelize-typescript';
import { UserRepositoryImpl } from './persistence/repositories/user.repository.impl';
import { UserRepository } from '@/context/user/domain/repositories/user.repository';

export const UserProvider = {
  provide: UserRepository,
  useFactory: async (sequelize: Sequelize) => new UserRepositoryImpl(sequelize),
  inject: ['Sequelize'],
};

export const PROVIDERS = [UserProvider];
