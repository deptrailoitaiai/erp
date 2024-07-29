import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    userName: string;

    @IsString()
    userEmail: string;

    @IsString()
    userPassword: string;

    @IsString()
    @IsOptional()
    userRole?: string; 
}

export class DeleteUserDto {
    @IsString()
    userEmail: string;
}

