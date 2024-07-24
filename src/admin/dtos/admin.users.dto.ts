import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    userName: string;

    @IsString()
    userEmail: string;

    @IsString()
    userPassword: string;
}

export class UpdateUserDto {
    @IsString()
    userName: string;

    @IsString()
    userEmail: string;

    @IsString()
    userPassword: string;
}

export class ReadUserDto {
    @IsString()
    userEmail: string;
}

export class DeleteUserDto {
    @IsString()
    userEmail: string;
}