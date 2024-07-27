import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JsonwebtokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    
}