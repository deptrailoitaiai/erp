import { IsEmail, IsOptional, IsString } from "class-validator";

export class SaveInformationDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    email?: string

    @IsString()
    citizenId: string;

    @IsString()
    address: string;
}