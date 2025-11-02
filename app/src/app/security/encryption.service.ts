import * as crypto from 'crypto'

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly secret = process.env.ENCRYPTION_KEY

  encrypt(text: string) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secret, 'hex'), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
  }

  decrypt(data: string) {
    const [ivHex, encryptedHex] = data.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const encryptedText = Buffer.from(encryptedHex, 'hex')
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secret, 'hex'), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }
}
