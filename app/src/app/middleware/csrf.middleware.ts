import type { NestMiddleware } from '@nestjs/common'
import csrf from 'csurf'

export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csrf({ cookie: true })

  use(req, res, next) {
    this.csrfProtection(req, res, next)
  }
}
