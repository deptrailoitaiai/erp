import { IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    roleName: string;
}

export class UpdateRolesDto{
    @IsString()
    roleName: string;
}

export class DeleteRoleDto{
    @IsString()
    roleName: string;
}