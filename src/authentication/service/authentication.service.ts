import { Injectable } from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";

@Injectable()
export class AuthenticationService {
    async login(loginDto: LoginDto) {
        
    }
}