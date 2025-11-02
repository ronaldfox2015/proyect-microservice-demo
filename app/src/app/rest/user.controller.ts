import { UserService } from '@/context/user/application/services/user.service'
import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller()
export class UserController {
  constructor(userService: UserService) {}

  @Get('health')
  @HttpCode(200)
  health(): any {
    return {
      code: 200,
      message: 'health',
      data: [],
    }
  }

  @Get('list')
  @HttpCode(200)
  demo(): any {
    return {
      code: 200,
      message: 'health',
      data: [],
    }
  }
}
