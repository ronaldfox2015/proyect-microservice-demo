import { randomUUID } from 'crypto'
import type { IncomingMessage, ServerResponse } from 'http'

export class PinoLoggerConfig {
  static getConfig() {
    try {
      return {
        pinoHttp: {
          autoLogging: true,
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:standard',
              ignore: 'req,res,req.headers,res.headers,responseTime,requestId,err',
            },
          },
          customProps: () => {
            try {
              return { requestId: randomUUID() }
            } catch (error) {
              console.error('Error in customProps:', error)
              return { requestId: 'unknown' }
            }
          },

          customSuccessMessage: (req: IncomingMessage & any, res: ServerResponse & any) => {
            try {
              const responseTime = res.getHeader('X-Response-Time') || '0 ms'
              const responseData = res.locals?.responseBody || null

              return JSON.stringify({
                type: 'INFO',
                statusCode: res.statusCode,
                message: 'Successful request',
                context: {
                  url: req.url,
                  method: req.method,
                  data: {
                    headers: {
                      srv: req.headers['srv'] || null,
                      'user-agent': req.headers['user-agent'] || null,
                      'x-forwarded-for': req.headers['x-forwarded-for'] || null,
                      'content-type': req.headers['content-type'] || null,
                    },
                    request: {
                      params: (req as any).params || {},
                      query: (req as any).query || {},
                      body: (req as any).raw?.body || {},
                    },
                  },
                },
                response: responseData,
                trace: null,
                responseTime,
              })
            } catch (error) {
              console.error('Error in customSuccessMessage:', error)
              return JSON.stringify({
                type: 'ERROR',
                statusCode: res?.statusCode || 500,
                message: 'Logger failed in customSuccessMessage',
                context: { url: req.url, method: req.method },
                trace: (error as Error)?.stack || null,
                responseTime: '0 ms',
              })
            }
          },

          // 👇 AQUÍ el cambio importante: orden correcto de los parámetros
          customErrorMessage: (
            req: IncomingMessage & any,
            res: ServerResponse & any,
            error: Error,
          ) => {
            try {
              const responseTime = '0 ms'
              const responseData = null

              return JSON.stringify({
                type: 'ERROR',
                statusCode: res?.statusCode || 500,
                message: error.message || 'Unexpected error',
                context: {
                  url: req.url,
                  method: req.method,
                  data: {
                    headers: {
                      srv: req.headers['srv'] || null,
                      'user-agent': req.headers['user-agent'] || null,
                      'x-forwarded-for': req.headers['x-forwarded-for'] || null,
                      'content-type': req.headers['content-type'] || null,
                    },
                    request: {
                      params: (req as any).params || {},
                      query: (req as any).query || {},
                      body: (req as any).raw?.body || {},
                    },
                  },
                },
                response: responseData,
                trace: error.stack || null,
                responseTime,
              })
            } catch (innerError) {
              console.error('Critical logger error in customErrorMessage:', innerError)
              return JSON.stringify({
                type: 'CRITICAL_LOGGER_ERROR',
                message: 'Logger crashed in customErrorMessage',
                trace: (innerError as Error)?.stack || null,
              })
            }
          },
        },
      }
    } catch (outerError) {
      console.error('Fatal error in PinoLoggerConfig.getConfig:', outerError)
      return {
        pinoHttp: {
          level: 'info',
        },
      }
    }
  }
}
