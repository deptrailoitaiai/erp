import { IsBoolean, IsString } from "class-validator";

export class SetProbationDto {
    @IsString()
    userEmail: string;

    @IsBoolean()
    setProbation: boolean;
}