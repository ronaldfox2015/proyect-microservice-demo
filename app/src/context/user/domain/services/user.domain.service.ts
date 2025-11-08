import { Injectable } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

/**
 * Servicio de dominio para User
 * Contiene la lógica de negocio pura del módulo.
 */
@Injectable()
export class UserDomainService {
  constructor(private readonly repository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findDomainById(id)
  }

  async countAll(): Promise<number> {
    const all = await this.repository.findDomainAll()
    return all.length
  }

  async createEntity(name: string, email: string): Promise<User> {
    const entity = User.create(name, email)
    return this.repository.create(entity)
  }

  async renameEntity(id: string, newName: string): Promise<User> {
    const entity = await this.repository.findDomainById(id)
    if (!entity) throw new Error(`User not found`)
    entity.updateName(newName)
    return this.repository.create(entity)
  }
}
