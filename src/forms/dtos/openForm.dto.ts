import { IsEnum, IsString } from "class-validator";
import { FormTypeEnum } from "src/admin/entities/forms.entity";

export class OpenFormDto {
    @IsEnum(FormTypeEnum)
    formType: FormTypeEnum;
}