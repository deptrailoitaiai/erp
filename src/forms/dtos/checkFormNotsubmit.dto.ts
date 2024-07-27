import { IsEnum } from "class-validator";
import { FormTypeEnum } from "src/admin/entities/forms.entity";

export class CheckFormNotSubmitDto {
    @IsEnum(FormTypeEnum)
    formType: FormTypeEnum;
}