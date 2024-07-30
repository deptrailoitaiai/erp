import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { FormTypeEnum } from "src/admin/entities/forms.entity";

class resubmit {
    @IsArray()
    @IsString({ each: true })
    email: string[];
}

export class SendEMailDto {
    @IsEnum(FormTypeEnum)
    formType: FormTypeEnum;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    specificEmail?: string[];

    @IsBoolean()
    @IsOptional()
    // @ValidateNested({ each: true })
    resubmit?: boolean;
}

