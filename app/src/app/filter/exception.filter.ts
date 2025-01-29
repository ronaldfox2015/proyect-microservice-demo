import { Catch, ExceptionFilter, ArgumentsHost, HttpException, NotFoundException } from '@nestjs/common'
import { ValidationError } from 'class-validator'

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    if (exception instanceof ValidationError) {
      return response.status(400).json({
        code: 400,
        message: 'Validation failed',
        data: exception['errors'],
      })
    }

    if (exception instanceof NotFoundException) {
      return response.status(500).json({
        code: 500,
        message: exception.message,
        data: [],
      })
    }

    console.log(exception)
    return response.status(500).json({
      code: 500,
      message: exception.message,
      data: [],
    })
  }
}
