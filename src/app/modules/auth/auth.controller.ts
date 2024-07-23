import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login-dto';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { AuthUser, JwtPayload } from 'src/app/decorators/user.auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Unprotected()
  loginKeycloak(@Body() body: LoginDto) {
    return this.authService.loginKeycloak(body);
  }

  @Get('/whoami')
  @Roles({ roles: ['user'] })
  whoami(@AuthUser() auth: JwtPayload) {
    const { preferred_username, name } = auth;

    return { username: preferred_username, name };
  }
}
