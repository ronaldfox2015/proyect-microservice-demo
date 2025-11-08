import { Injectable } from '@nestjs/common'
import { User } from '@/context/user/domain/entities/user.entity'
import { UserRepository } from '@/context/user/domain/repositories/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async all(): Promise<User[]> {
    return this.repository.findDomainAll()
  }

  async create(data: Partial<User>): Promise<User> {
    const entity = User.create(data.name!, data.email!)
    return this.repository.create(entity)
  }
}
