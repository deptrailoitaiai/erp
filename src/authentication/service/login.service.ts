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
        const getIdPassword = await this.usersRepo.authenticationModuleLogin(loginFormDto)
        if(!getIdPassword[0].userId) return ('Invalid email')
        
        const checkPassword = await bcrypt.compare(loginFormDto.password, getIdPassword[0].password)
        if(!checkPassword) return ('Invalid password')

        const userId = getIdPassword[0].userId
        const roles = getIdPassword.map(i => i.role)

        const payload = { sub: userId, role: roles } // role name ?

        return await this.jwtService.signAsync(payload)
        
    }
}