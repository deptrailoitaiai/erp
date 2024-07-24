import { IsIn, IsString } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsIn(['probation', 'annual', 'information'])
    module: string;

    @IsString()
    @IsIn(['read', 'readOwner', 'write', 'update', 'delete', 'approve'])
    action: string;
}

export class DeletePermissionDto {
    @IsString()
    @IsIn(['probation', 'annual', 'information'])
    module: string;

    @IsString()
    @IsIn(['read', 'readOwner', 'write', 'update', 'delete', 'approve'])
    action: string;
}