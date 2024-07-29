import { IsString } from "class-validator";

export class RolesUsersGrantDto {
    @IsString()
    email: string;

    @IsString()
    role: string[]
}

export class RolesUsersRevokeDto {
    @IsString()
    email: string;

    @IsString()
    role: string[]
}