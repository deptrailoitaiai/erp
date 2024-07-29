import { Body, Controller, Get, Post } from "@nestjs/common";
import { AdminService } from "./services/admin.service";
import { CreateUserDto, DeleteUserDto } from "./dtos/users.dto";
import { CreateRoleDto } from "./dtos/roles.dto";
import { CreatePermissionDto } from "./dtos/permissions.dto";
import { RolesUsersGrantDto, RolesUsersRevokeDto } from "./dtos/rolesUsers.dto";

@Controller('admin')
export class AdminController {
    constructor(public readonly adminService: AdminService) {}

    @Post('/user/create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const createUser =  await this.adminService.createUser(createUserDto);
        return 'created'
    }

    @Post('/user/delete')
    async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
        const deleteUser = await this.adminService.deleteUser(deleteUserDto);
        return 'deleted'
    }

    // @Post('/user/update')
    // async updateUser() {}

    // @Get('/user/read')
    // async readUser() {}

    @Post('/role/create')
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        const createRole = await this.adminService.createRole(createRoleDto);
        return 'created'
    }

    // @Post('/role/delete')
    // async deleteRole() {}

    // @Post('/role/update')
    // async updateRole() {}

    // @Get('/role/read')
    // async readRole() {}

    @Post('/permission/create')
    async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        const createPermission = await this.adminService.createPermission(createPermissionDto);
        if(createPermission == 'permission created') return createPermission
        return 'created'
    }

    // @Post('/permission/delete')
    // async deletePermission() {}

    // @Post('/permission/update')
    // async updatePermission() {}

    // @Get('/permission/read')
    // async readPermission() {}

    @Post('/roleUser/grant')
    async grantRoleUser(@Body() rolesUsersGrantDto: RolesUsersGrantDto) {
        const grantRoleUser = await this.adminService.grantRoleUser(rolesUsersGrantDto);
        return 'granted'
    }

    @Post('/roleUser/revoke')
    async revokeRoleUser(@Body() rolesUsersRevokeDto: RolesUsersRevokeDto) {
        const revokeRoleUser = await this.adminService.revokeRoleUser(rolesUsersRevokeDto);
        return 'revoked'
    }

    @Post('/rolePermission/grant')
    async grantRolePermission() {}

    @Post('/rolePermission/revoke')
    async revokeRolePermission() {}
}