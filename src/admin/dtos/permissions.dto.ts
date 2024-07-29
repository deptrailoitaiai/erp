import { IsEnum } from "class-validator";
import { actionEnum, moduleEnum } from "../entities/permissions.entity";

export class CreatePermissionDto {
    @IsEnum(moduleEnum)
    module: moduleEnum;

    @IsEnum(actionEnum)
    action: actionEnum;
}