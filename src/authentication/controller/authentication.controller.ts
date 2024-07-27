import { Body, Controller, Res, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../service/login.service';
import { JwtService } from '@nestjs/jwt';
import { loginFormDto } from '../dto/loginForm.dto';
import { Response } from 'express';

@Controller()
export class AuthenticationController {
  constructor(private readonly loginService: LoginService) {}
  async login(@Body() loginFormDto: loginFormDto, @Res() res: Response) {
    const login = await this.loginService.login(loginFormDto);
    if (login == 'Invalid email' || login == 'Invalid password'){
      return new UnauthorizedException(login)
    }

    res.cookie('access_token', login)
    return 'loged in'
  }
}
