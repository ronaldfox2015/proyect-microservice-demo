import { randomUUID } from 'crypto'

/**
 * Entidad de dominio: User
 */
export class User {
  readonly id: string
  name: string
  email: string
  readonly createdAt: Date

  constructor(props: { id?: string; name: string; email: string; createdAt?: Date }) {
    const { id, name, email, createdAt } = props
    if (!name?.trim()) throw new Error('Name cannot be empty')
    if (!email.includes('@')) throw new Error('Invalid email')
    this.id = id ?? randomUUID()
    this.name = name.trim()
    this.email = email.trim()
    this.createdAt = createdAt ?? new Date()
  }

  static create(name: string, email: string): User {
    return new User({ name, email, createdAt: new Date() })
  }

  updateName(newName: string) {
    if (!newName?.trim()) throw new Error('Invalid name')
    this.name = newName.trim()
  }

  toPrimitives() {
    return { id: this.id, name: this.name, email: this.email, createdAt: this.createdAt }
  }
}
