import { Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./service/authentication.service";
import { LoginDto } from "./dtos/login.dto";

@Controller('authenticate')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('/login')
    async login(loginDto: LoginDto) {
        return await this.authService.login(loginDto)
    }
}