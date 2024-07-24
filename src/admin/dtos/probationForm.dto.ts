import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { formTypeEnum } from "../entities/forms.entity";

export class ProbationFormDto {
    @IsEnum(formTypeEnum)
    @IsOptional()
    formType: formTypeEnum;

    @IsInt()
    performance: number;

    @IsInt()
    productivity: number;

    @IsString()
    employeeOpinion: string;
}