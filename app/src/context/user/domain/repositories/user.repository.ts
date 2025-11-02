import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(entity: User): Promise<User>;
  abstract findDomainById(id: string): Promise<User | null>;
  abstract findDomainAll(): Promise<User[]>;
}
