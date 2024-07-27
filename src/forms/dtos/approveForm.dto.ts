import { IsInt, IsString, Max, Min, ValidateIf } from "class-validator";

export class ApproveFormDto {
    @IsString()
    formId: string;

    @IsString()
    superiorOpinion: string;

    @IsInt()
    @Min(1)
    @Max(10)
    @ValidateIf(i => i.superiorOpinion != "reject")
    total: number;
}