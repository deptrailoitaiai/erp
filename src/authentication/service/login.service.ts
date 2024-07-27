import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { loginFormDto } from "../dto/loginForm.dto";
import { UsersRepository } from "src/admin/repositories/users.repository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService { 
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersRepo: UsersRepository
    ) {}

    async login(loginFormDto: loginFormDto) {
        const getEmailPassword = await this.usersRepo.authenticationModuleLogin(loginFormDto)
        if(!getEmailPassword.userEmail) return ('Invalid email')
        
        const checkPassword = await bcrypt.compare(loginFormDto.password, getEmailPassword.userPassword)
        if(!checkPassword) return ('Invalid password')

        const payload = { sub: getEmailPassword.userId }

        return await this.jwtService.signAsync(payload)
        
    }
}