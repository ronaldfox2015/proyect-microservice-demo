import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags()
@Controller()
export class DefaultController {
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
