import { IsString } from "class-validator";

export class GrantRoleUserDto {
    @IsString()
    email: string;

    @IsString()
    role: string;
}

export class RevokeRoleUserDto {
    @IsString()
    email: string;

    @IsString()
    role: string;
}

export class ModifyRoleUser {
    
}