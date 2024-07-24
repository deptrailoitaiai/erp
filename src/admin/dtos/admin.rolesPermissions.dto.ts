import { IsIn, IsString } from "class-validator";

export class GrantPermissionRoleDto {
    @IsString()
    roleName: string;

    @IsString()
    @IsIn(['probation', 'annual', 'information'])
    module: string;

    @IsString()
    @IsIn(['read', 'write', 'update', 'delete', 'approve'])
    action: string;
}

export class RevokePermissionRoleDto {
    @IsString()
    roleName: string;

    @IsString()
    @IsIn(['probation', 'annual', 'information'])
    module: string;

    @IsString()
    @IsIn(['read', 'write', 'update', 'delete', 'approve'])
    action: string;
}