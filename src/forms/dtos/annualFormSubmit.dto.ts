import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { FormTypeEnum } from "src/admin/entities/forms.entity";

export class AnnualFormDto {
    @IsString()
    achievement: string;

    @IsInt()
    performance: number;

    @IsInt()
    productivity: number;

    @IsString()
    userOpinion: string;
}