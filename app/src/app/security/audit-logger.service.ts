import { randomUUID } from 'crypto'

export class PinoLoggerConfig {
  static getConfig() {
    return {
      pinoHttp: {
        autoLogging: true,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  ignore: 'req,res,req.headers,res.headers,responseTime,requestId',
                },
              }
            : undefined,

        customProps: (req, res) => {
          const start = process.hrtime()

          return { requestId: randomUUID() }
        },

        customSuccessMessage: (req, res) => {
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
                  params: req.params || {},
                  query: req.query || {},
                  body: req.raw?.body || {},
                },
              },
            },
            response: responseData,
            trace: null,
            responseTime,
          })
        },

        customErrorMessage: (error, req, res) => {
          const responseTime = res.getHeader('X-Response-Time') || '0 ms'
          const responseData = res.locals?.responseBody || null

          return JSON.stringify({
            type: 'ERROR',
            statusCode: res?.statusCode || 500,
            message: error.message || 'Unexpected error',
            context: {
              url: req.url,
              method: req.method,
              data: {
                headers: req.headers,
                request: {
                  params: req.params || {},
                  query: req.query || {},
                  body: req.raw?.body || {},
                },
              },
            },
            response: responseData,
            trace: error.stack || null,
            responseTime,
          })
        },
      },
    }
  }
}
