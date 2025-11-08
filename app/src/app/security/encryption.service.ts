import * as crypto from 'crypto'

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly secret = 'demo' // 64 hex chars (32 bytes)

  decrypt(encryptedData: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.secret, 'hex'),
      iv,
      { authTagLength: 16 }, // ✅ explícitamente define el tag length
    )

    decipher.setAuthTag(authTag) // ✅ importante para GCM

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
