import { Injectable } from '@nestjs/common';
import { CreateUserDto, DeleteUserDto } from '../dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';
import { RolesRepository } from '../repositories/roles.repository';
import { CreateRoleDto } from '../dtos/roles.dto';
import { CreatePermissionDto } from '../dtos/permissions.dto';
import { PermissionsRepository } from '../repositories/permission.repository';
import { FormsRepository } from '../repositories/forms.repository';
import { UsersFormsRepository } from '../repositories/usersForms.repository';
import { UserInformationsRepository } from '../repositories/userInfomations.repository';
import { RolesUsersGrantDto, RolesUsersRevokeDto } from '../dtos/rolesUsers.dto';
import { RolesUsersRepository } from '../repositories/rolesUsers.repository';
import { RoleEnum } from '../entities/roles.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly rolesRepo: RolesRepository,
    private readonly permissionsRepo: PermissionsRepository,
    private readonly formsRepo: FormsRepository,
    private readonly usersFormsRepo: UsersFormsRepository,
    private readonly userInformationRepo: UserInformationsRepository,
    private readonly rolesUsersRepo: RolesUsersRepository
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const userExisted =
      await this.usersRepo.adminModuleCreateUserCheckUserExists(createUserDto);
    if (userExisted) return 'user existed';

    createUserDto.userPassword = await bcrypt.hashSync(
      createUserDto.userPassword,
      10,
    );

    const saveuser =
      await this.usersRepo.adminModuleCreateUserSaveUser(createUserDto);

    const setRole = await this.usersRepo.adminModuleCreateUserSetRole(
      createUserDto,
      saveuser.userId,
      createUserDto.userRole,
    );

    // grant approve form to user has right role
    if (
      createUserDto.userRole
        .split(',')
        .some((i) => ['Manager', 'Director', 'Admin'].includes(i))
    ) {
      const userId = saveuser.userId;
      const formIdSubmited =
        await this.formsRepo.adminModuleCreateDeleteUserGetIdFormSubmited();
      const grantFormSubmited =
        await this.usersFormsRepo.adminModuleCreateUserGrantFormSubmited(
          userId,
          formIdSubmited,
        );
    }
    // create user infomation
    const createUserInformation = await this.userInformationRepo.adminModuleCreateUserCreateUserInfor(saveuser, createUserDto.userRole)


    return 'user and role created';
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    return await this.usersRepo.adminModuleDeleteUser(deleteUserDto);
  }

  // async updateUser() {}

  // async readUser() {}

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.rolesRepo.adminModuleCreateRole(createRoleDto.roleName);
  }

  // async deleteRole() {}

  // async updateRole() {}

  // async readRole() {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    return await this.permissionsRepo.adminModuleCreatePermission(
      createPermissionDto,
    );
  }

  // async deletePermission() {}

  // async updatePermission() {}

  // async readPermission() {}

  async grantRoleUser(rolesUsersGrantDto: RolesUsersGrantDto) {
    // check exist 
    const getRolesAndUser = await this.rolesRepo.adminModuleGrantRevokeRoleUserGetRole(rolesUsersGrantDto.email)
    const userId = getRolesAndUser[0].userId;
    const userEmail = getRolesAndUser[0].userEmail;
    const roleName = getRolesAndUser.map((i) => i.roleName);
    if(userEmail != rolesUsersGrantDto.email) return 'user not found';
    if(rolesUsersGrantDto.role.some(i => roleName.includes(i))) return 'role existed';

    if(rolesUsersGrantDto.role.some(i => "Director")) return await this.grantRoleUserIfDirector(userId);
    if(rolesUsersGrantDto.role.some(i => "Manager")) await this.grantRoleUserIfManager(userId)
    if(rolesUsersGrantDto.role.some(i => "Hr")) await this.grantRoleUserIfHr(userId)
  }

  async revokeRoleUser(rolesUsersRevokeDto: RolesUsersRevokeDto) {
    // check exist 
    const getRolesAndUser = await this.rolesRepo.adminModuleGrantRevokeRoleUserGetRole(rolesUsersRevokeDto.email)
    const userId = getRolesAndUser[0].userId;
    const userEmail = getRolesAndUser[0].userEmail;
    const roleName = getRolesAndUser.map((i) => i.roleName);
    if(userEmail != rolesUsersRevokeDto.email) return 'user not found';
    if(rolesUsersRevokeDto.role.some(i => !roleName.includes(i))) return 'role not existed';

    if(rolesUsersRevokeDto.role.some(i => "Director")) await this.revokeRoleUserIfDirector(userId);
    if(rolesUsersRevokeDto.role.some(i => "Manager")) await this.revokeRoleUserIfManager(userId);
    if(rolesUsersRevokeDto.role.some(i => "Hr")) await this.revokeRoleUserIfHr(userId);

  }

  async grantRolePermission() {}

  async revokeRolePermission() {}

  // sub functions

  async grantRoleUserIfHr(userId: string) {
    const grant = await this.rolesUsersRepo.adminModuleGrantRoleUserIfHr(userId);
  }

  async grantRoleUserIfManager(userId: string) {
    const grant = await this.rolesUsersRepo.adminModuleGrantRoleUserIfManager(userId);
  }

  async grantRoleUserIfDirector(userId: string) {
    const grantHr = await this.grantRoleUserIfHr(userId);
    const grantManager = await this.grantRoleUserIfManager(userId);
  }

  async revokeRoleUserIfHr(userId: string) {
    return await this.rolesUsersRepo.adminModuleRevokeRoleUserIfHr(userId);
  }

  async revokeRoleUserIfManager(userId: string) {
    return await this.rolesUsersRepo.adminModuleRevokeRoleUserIfManagerOrDirector(userId, 'Manager' as RoleEnum)
  }

  async revokeRoleUserIfDirector(userId: string) {
    return await this.rolesUsersRepo.adminModuleRevokeRoleUserIfManagerOrDirector(userId, 'Director' as RoleEnum)
  }
}
