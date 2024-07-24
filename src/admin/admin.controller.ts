import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { CreateUserDto, DeleteUserDto } from './dtos/admin.users.dto';
import { UserRolePermissionRepository } from './repositories/userRolePermission.repository';
import { CreateRoleDto, DeleteRoleDto } from './dtos/admin.roles.dto';
import {
  CreatePermissionDto,
  DeletePermissionDto,
} from './dtos/admin.permissions.dto';
import {
  GrantRoleUserDto,
  RevokeRoleUserDto,
} from './dtos/admin.rolesUsers.dto';
import {
  GrantPermissionRoleDto,
  RevokePermissionRoleDto,
} from './dtos/admin.rolesPermissions.dto';
import { log } from 'console';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminRepo: AdminRepository,
    private readonly userRolePermissionRepository: UserRolePermissionRepository,
  ) {}

  // user
  @Post('/user/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userRolePermissionRepository.createUser(createUserDto);
  }

  @Post('/user/delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return await this.userRolePermissionRepository.DeleteUserDto(deleteUserDto);
  }
  // end

  // role
  @Post('/role/create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.userRolePermissionRepository.createRole(createRoleDto);
  }

  @Post('/role/delete')
  async deleteRole(@Body() deleteRoleDto: DeleteRoleDto) {
    return await this.userRolePermissionRepository.DeleteRoleDto(deleteRoleDto);
  }
  // end

  // permission
  @Post('/permission/create')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.userRolePermissionRepository.createPermission(
      createPermissionDto,
    );
  }

  @Post('/permission/delete')
  async deletePermission(@Body() deletePermissionDto: DeletePermissionDto) {
    return await this.userRolePermissionRepository.deletePermission(
      deletePermissionDto,
    );
  }
  // end

  // role user
  @Post('/roleUser/grant')
  async grantRoleUser(@Body() grantRoleUser: GrantRoleUserDto) {
    return await this.userRolePermissionRepository.grantRoleUser(grantRoleUser);
  }

  @Post('/roleUser/revoke')
  async revokeRoleUser(@Body() revokeRoleUser: RevokeRoleUserDto) {
    return await this.userRolePermissionRepository.revokeRoleUser(
      revokeRoleUser,
    );
  }
  // end

  // role permission
  @Post('permissionRole/grant')
  async grantPermissionRole(@Body() grantPermissionRoleDto: GrantPermissionRoleDto) {
    return await this.userRolePermissionRepository.grantPermissionRole(
      grantPermissionRoleDto,
    );
  }

  @Post('/permissionRole/revoke')
  async revokePermissionRole(@Body() revokePermissionRoleDto: RevokePermissionRoleDto) {
    return await this.userRolePermissionRepository.revokePermissionRole(
      revokePermissionRoleDto,
    );
  }
  // end
}
