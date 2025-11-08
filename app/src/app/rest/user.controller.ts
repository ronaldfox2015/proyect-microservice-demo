import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from '@/context/user/application/services/user.service'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}

  @Get('list')
  @HttpCode(200)
  demo(): any {
    return {
      code: 200,
      message: 'health',
      data: this.userService.all(),
    }
  }
}
