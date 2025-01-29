import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller()
export class UserController {
  constructor() {}

  @Get('health')
  @HttpCode(200)
  health(): any {
    return {
      code: 200,
      message: 'health',
      data: [],
    }
  }
}
