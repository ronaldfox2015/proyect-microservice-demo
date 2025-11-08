import type { NestMiddleware } from '@nestjs/common'
import rateLimit from 'express-rate-limit'

export class RateLimitMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: '❌ Demasiadas solicitudes. Inténtalo más tarde.',
  })

  use(req, res, next) {
    this.limiter(req, res, next)
  }
}
