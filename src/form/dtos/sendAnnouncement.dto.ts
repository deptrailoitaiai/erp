import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

enum formType {
    probation = "probation",
    annual = "annual",
}


export class SendAnnouncementDto {
    @IsEnum(formType)
    formType: formType;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    specificEmployee?: string[];

    @IsBoolean()
    @IsOptional()
    resubmit?: true;
}

export class CheckFormDto {
    @IsEnum(formType)
    formType: formType;
}