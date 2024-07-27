import { IsString } from "class-validator";

export class SaveInformationDto {
    @IsString()
    citizenId: string;

    @IsString()
    address: string;
}