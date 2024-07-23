import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, Resource, Roles, Unprotected } from 'nest-keycloak-connect';
import { UserService } from './user.service';

@Controller('user')
@Resource('Default Resource')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/public')
  @Unprotected()
  getpublic(): string {
    return `${this.userService.getHello()} from public`;
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  // @Roles('realm:app-user') // protected using realm role
  getUser(): string {
    return `${this.userService.getHello()} from user`;
  }

  @Get('/admin')
  @Roles({ roles: ['admin'] })
  // @Scopes('read-scope')
  getAdmin(): string {
    return `${this.userService.getHello()} from admin`;
  }

  @Get('/all')
  @Roles({ roles: [] })
  getAll(): string {
    return `${this.userService.getHello()} from all`;
  }
}
