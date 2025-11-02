import * as argon2 from 'argon2'

export class HashingService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 5,
      parallelism: 2,
    })
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
