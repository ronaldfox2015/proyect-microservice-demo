import type { NestMiddleware } from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true },
      referrerPolicy: { policy: 'no-referrer' },
    })(req, res, next)
  }
}
