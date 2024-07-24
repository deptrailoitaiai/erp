import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { formTypeEnum } from "src/admin/entities/forms.entity";

export class GetEmailDto {
    @IsEnum(formTypeEnum)
    formType: formTypeEnum;
}

export class GetFormDto {
    @IsEnum(formTypeEnum)
    formType: formTypeEnum;

    @IsString()
    email: string;
}

class ApproveFormDto {
    @IsString()
    superiorOpinion: string;

    @IsInt()
    total: number;
}

export class ApproveFormOptionDto {
    @IsString()
    formId: string;

    @IsBoolean()
    @IsOptional()
    reject: boolean;

    @ValidateIf(o => o.reject == false)
    @IsObject()
    @ValidateNested()
    @Type(() => ApproveFormDto)
    approve: ApproveFormDto;
}