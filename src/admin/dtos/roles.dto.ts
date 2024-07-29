import { IsEnum, IsString } from "class-validator";
import { RoleEnum } from "../entities/roles.entity";

export class CreateRoleDto {
    @IsEnum(RoleEnum) 
    roleName: RoleEnum;
}

