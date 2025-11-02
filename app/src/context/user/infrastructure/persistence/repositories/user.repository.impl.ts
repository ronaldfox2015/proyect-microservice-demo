import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { MysqlRepositoryImpl } from '@bdd-backend/common/dist/infrastructure/repositories/mysql.repository.impl';
import { UserModel } from '../models/user.model';
import { UserRepository } from '@/context/user/domain/repositories/user.repository';
import { User } from '@/context/user/domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl
  extends MysqlRepositoryImpl<UserModel>
  implements UserRepository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, UserModel);
  }

  async create(entity: User): Promise<User> {
    const record = await super.save(entity);
    return new User(record.dataValues);
  }

  async findDomainById(id: string): Promise<User | null> {
    const record = await super.findById(id);
    return record ? new User(record.dataValues) : null;
  }

  async findDomainAll(): Promise<User[]> {
    const records = await super.findAll();
    return records.map(r => new User(r.dataValues));
  }
}
