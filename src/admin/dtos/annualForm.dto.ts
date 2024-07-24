import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { formTypeEnum } from "../entities/forms.entity";

export class AnnualFormDto {
    @IsEnum(formTypeEnum)
    @IsOptional()
    formType: formTypeEnum;

    @IsString()
    achievement: string;

    @IsInt()
    performance: number;

    @IsInt()
    productivity: number;

    @IsString()
    employeeOpinion: string;
}