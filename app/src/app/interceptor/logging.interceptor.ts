import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, headers, body, params, query } = request
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        const statusCode = response.statusCode
        const duration = `${Date.now() - start} ms`

        const logObject = {
          type: 'INFO',
          statusCode,
          message: 'Successful request',
          context: {
            url,
            method,
            data: {
              headers: {
                srv: headers['srv'] || null,
                'user-agent': headers['user-agent'] || null,
                'x-forwarded-for': headers['x-forwarded-for'] || null,
                'content-type': headers['content-type'] || null,
              },
              request: {
                params: params || {},
                query: query || {},
                body: body || {},
              },
            },
          },
          trace: null,
          responseTime: duration,
        }

        this.logger.log(JSON.stringify(logObject, null, 4))
      }),
    )
  }
}
