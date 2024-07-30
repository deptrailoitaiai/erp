import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../service/login.service';
import { JwtService } from '@nestjs/jwt';
import { loginFormDto } from '../dto/loginForm.dto';
import { Response } from 'express';
import { responseSuccess } from 'src/config/response';

@Controller('/authen')
export class AuthenticationController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/login')
  async login(@Body() loginFormDto: loginFormDto, @Res() res: Response) {
    const login = await this.loginService.login(loginFormDto);
    if (login == 'Invalid email' || login == 'Invalid password'){
      return res.send(new UnauthorizedException(login))
    }

    console.log(login);
    res.cookie('access_token', login);
    res.send(responseSuccess('login success'))
  }
}
