import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { CreateUserDto, DeleteUserDto } from './dtos/users.dto';
import { CreateRoleDto } from './dtos/roles.dto';
import { CreatePermissionDto } from './dtos/permissions.dto';
import { RolesUsersGrantDto, RolesUsersRevokeDto } from './dtos/rolesUsers.dto';
import { responseFail, responseSuccess } from 'src/config/response';
import { UsersRepository } from './repositories/users.repository';
import { SetProbationDto } from './dtos/setProbation.dto';
import { UserInformationsRepository } from './repositories/userInfomations.repository';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersRepo: UsersRepository,
    private readonly userInformationsRepo: UserInformationsRepository
  ) {}

  @Post('/user/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createUser = await this.adminService.createUser(createUserDto);
    if (createUser == 'user existed') {
      return responseFail(409, 'user already exists');
    }

    return responseSuccess({
      userName: createUser.userId,
      userEmail: createUser.userEmail,
      userId: createUser.userId,
    });
  }

  @Post('/user/delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    const deleteUser = await this.adminService.deleteUser(deleteUserDto);
    if(deleteUser === "user not found") return responseFail(404,'user not found');

    if(deleteUser === "deteted") return responseSuccess({ message: "user deleted" })
  }

  // @Post('/user/update')
  // async updateUser() {}

  @Get('/user/read')
  async readUser() {
    return responseSuccess(await this.usersRepo.adminModuleReadUser())
  }

  @Post('/role/create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const createRole = await this.adminService.createRole(createRoleDto);
    return 'created';
  }

  // @Post('/role/delete')
  // async deleteRole() {}

  // @Post('/role/update')
  // async updateRole() {}

  // @Get('/role/read')
  // async readRole() {}

  @Post('/permission/create')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const createPermission =
      await this.adminService.createPermission(createPermissionDto);
    if (createPermission == 'permission created') return createPermission;
    return 'created';
  }

  // @Post('/permission/delete')
  // async deletePermission() {}

  // @Post('/permission/update')
  // async updatePermission() {}

  // @Get('/permission/read')
  // async readPermission() {}

  @Post('/roleUser/grant')
  async grantRoleUser(@Body() rolesUsersGrantDto: RolesUsersGrantDto) {
    const grantRoleUser =
      await this.adminService.grantRoleUser(rolesUsersGrantDto);
    
    if(grantRoleUser === 'role existed') return responseFail(409, 'Role already exists')
    if(grantRoleUser === 'user not found') return responseFail(404, 'User not found')
    return responseSuccess({ message: "granted role" })
  }

  @Post('/roleUser/revoke')
  async revokeRoleUser(@Body() rolesUsersRevokeDto: RolesUsersRevokeDto) {
    const revokeRoleUser =
      await this.adminService.revokeRoleUser(rolesUsersRevokeDto);
      if(revokeRoleUser === 'role not existed') return responseFail(404, 'Role not exists')
      if(revokeRoleUser === 'user not found') return responseFail(404, 'User not found')
      return responseSuccess({ message: "revoked role" })
  }

  @Post('/rolePermission/grant')
  async grantRolePermission() {}

  @Post('/rolePermission/revoke')
  async revokeRolePermission() {}

  @Post('/setProbation')
  async setProbation(@Body() setProbationDto: SetProbationDto) {
    const setProbation = await this.userInformationsRepo.adminModuleSetProbation(setProbationDto)
    if(setProbation == 1) return responseFail(404, 'user not found')
    if(setProbation == 2) return responseFail(409, 'this status is already set')

    return responseSuccess(setProbation)
  }
}
