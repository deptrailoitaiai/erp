import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JsonwebtokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async checkRoleByAccessToken(accessToken: string, roleExpect: string[]) {
        try {
            const payload: { sub: string, role: string[] } = await this.jwtService.verifyAsync(accessToken)
            console.log(payload)

            if(payload.role.some(i => roleExpect.includes(i))) return payload.sub;

            return false;

        } catch (error) {
            return false;
        }
    }

    async checkAccessTokenAndGetId(accessToken: string) {
        try {
            const payload: { sub: string, role: string[] } = await this.jwtService.verifyAsync(accessToken)

            return payload.sub;

        } catch (error) {
            return false;
        }
    }
}