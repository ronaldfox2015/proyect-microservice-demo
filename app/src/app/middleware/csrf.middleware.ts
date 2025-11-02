import csrf from 'csurf'
import { NestMiddleware } from '@nestjs/common'

export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csrf({ cookie: true })

  use(req, res, next) {
    this.csrfProtection(req, res, next)
  }
}
