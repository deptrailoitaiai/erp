import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { FormTypeEnum } from "src/admin/entities/forms.entity";

export class ProbationFormDto {
    @IsInt()
    @IsOptional()
    performance?: number;

    @IsInt()
    @IsOptional()
    productivity?: number;

    @IsString()
    @IsOptional()
    userOpinion?: string;
}