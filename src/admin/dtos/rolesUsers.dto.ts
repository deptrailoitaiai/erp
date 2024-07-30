import { IsArray, IsString } from "class-validator";

export class RolesUsersGrantDto {
    @IsString()
    email: string;

    @IsArray()
    @IsString({ each: true })
    role: string[]
}

export class RolesUsersRevokeDto {
    @IsString()
    email: string;

    @IsArray()
    @IsString({ each: true })
    role: string[];
}