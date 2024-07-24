import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { RolesEntity } from '../entities/roles.entity';
import {
  actionEnum,
  moduleEnum,
  PermissionsEntity,
} from '../entities/permissions.entity';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { RolesPermissionsEntity } from '../entities/rolesPermissions.entity';
import { FormsEntity } from '../entities/forms.entity';
import { EmployeeInformationsEntity } from '../entities/employeeInformations.entity';
import { UsersFormsEntity } from '../entities/usersForms.entity';
import {
  CreateUserDto,
  DeleteUserDto,
  ReadUserDto,
} from '../dtos/admin.users.dto';
import { CreateRoleDto, DeleteRoleDto } from '../dtos/admin.roles.dto';
import {
  CreatePermissionDto,
  DeletePermissionDto,
} from '../dtos/admin.permissions.dto';
import {
  GrantRoleUserDto,
  RevokeRoleUserDto,
} from '../dtos/admin.rolesUsers.dto';
import {
  GrantPermissionRoleDto,
  RevokePermissionRoleDto,
} from '../dtos/admin.rolesPermissions.dto';
import { AfterSaveRepository } from './afterSave.repository';

@Injectable()
export class UserRolePermissionRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepo: Repository<PermissionsEntity>,
    @InjectRepository(RolesUsersEntity)
    private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    @InjectRepository(RolesPermissionsEntity)
    private readonly rolesPermissionsRepo: Repository<RolesPermissionsEntity>,
    @InjectRepository(FormsEntity)
    private readonly formsRepo: Repository<FormsEntity>,
    @InjectRepository(EmployeeInformationsEntity)
    private readonly employeeInformationsRepo: Repository<EmployeeInformationsEntity>,
    @InjectRepository(UsersFormsEntity)
    private readonly usersFormsRepo: Repository<UsersFormsEntity>,
    private readonly afterSaveRepo: AfterSaveRepository,
  ) {}

  // user
  async createUser(createUserDto: CreateUserDto) {
    const checkExisted = await this.usersRepo.findOneBy({
      userEmail: createUserDto.userEmail,
    });


    if (checkExisted) return 'user has existed';

    const saveUser = await this.usersRepo.save(createUserDto);

    return saveUser
  }

  async readUser(readUserDto: ReadUserDto) {
    return await this.usersRepo.findOneBy({ userEmail: readUserDto.userEmail });
  }

  async DeleteUserDto(deleteUserDto: DeleteUserDto) {
    return await this.usersRepo
      .createQueryBuilder('users')
      .delete()
      .from(UsersEntity)
      .where('users.user_email = :email', { email: deleteUserDto.userEmail })
      .execute();
  }
  // end

  // role
  async createRole(createRoleDto: CreateRoleDto) {
    const checkExisted = await this.rolesRepo.findOneBy({
      roleName: createRoleDto.roleName,
    });

    if (checkExisted) return 'role has existed';

    return this.rolesRepo.save(createRoleDto);
  }

  async DeleteRoleDto(deleteRoleDto: DeleteRoleDto) {
    return await this.rolesRepo
      .createQueryBuilder('roles')
      .delete()
      .from(RolesEntity)
      .where('roles.role_name = :role', { role: deleteRoleDto.roleName })
      .execute();
  }
  // end

  // permission
  async createPermission(createPermissionDto: CreatePermissionDto) {
    return await this.permissionsRepo
      .createQueryBuilder()
      .insert()
      .into(PermissionsEntity)
      .values({
        module: createPermissionDto.module as moduleEnum,
        action: createPermissionDto.action as actionEnum,
      })
      .execute();
  }

  async deletePermission(deletePermissionDto: DeletePermissionDto) {
    return await this.permissionsRepo
      .createQueryBuilder()
      .delete()
      .from(PermissionsEntity)
      .where('module = :module', { module: deletePermissionDto.module })
      .andWhere('action = :action', { action: deletePermissionDto.action })
      .execute();
  }
  // end

  // role user
  async grantRoleUser(grantRoleUser: GrantRoleUserDto) {
    const userId = (
      await this.usersRepo.findOneBy({ userEmail: grantRoleUser.email })
    );
    const roleId = (
      await this.rolesRepo.findOneBy({ roleName: grantRoleUser.role })
    );
    const promiseAll = await Promise.all([userId.userId, roleId.roleId]);
    const findRoleUser = await this.rolesUsersRepo
      .createQueryBuilder()
      .select()
      .where('user_id = :userid', { userid: promiseAll[0] })
      .andWhere('role_id = :roleid', { roleid: promiseAll[1] })
      .execute();

    if (
      findRoleUser.length != 0 ||
      promiseAll[0] == undefined ||
      promiseAll[1] == undefined
    ) {
      return 'user have already have this role or user, role not exited';
    }

    const save =  await this.rolesUsersRepo
      .createQueryBuilder()
      .insert()
      .into(RolesUsersEntity)
      .values({
        userId: { userId: promiseAll[0] },
        roleId: { roleId: promiseAll[1] },
      })
      .execute();

      
    // after save
    const afterSaveUserForm = this.afterSaveRepo.afterSaveUserForm(userId);
    const afterSaveUserEmployeeInformation = this.afterSaveRepo.afterSaveUserEmployeeInformation(userId);
    //end
      
    return save
  }

  async revokeRoleUser(revokeRoleUser: RevokeRoleUserDto) {
    const userId = (
      await this.usersRepo.findOneBy({ userEmail: revokeRoleUser.email })
    ).userId;
    const roleId = (
      await this.rolesRepo.findOneBy({ roleName: revokeRoleUser.role })
    ).roleId;
    const promiseAll = await Promise.all([userId, roleId]);

    return await this.rolesUsersRepo
      .createQueryBuilder()
      .delete()
      .from(RolesUsersEntity)
      .where('user_id = :userId', { userId: promiseAll[0] })
      .andWhere('role_id = :roleId', { roleId: promiseAll[1] })
      .execute();
  }
  // end

  // role permission
  async grantPermissionRole(grantPermissionRoleDto: GrantPermissionRoleDto) {
    const [role, permission] = await Promise.all([
      this.rolesRepo.findOneBy({ roleName: grantPermissionRoleDto.roleName }),
      this.permissionsRepo.findOneBy({
        module: grantPermissionRoleDto.module as moduleEnum,
        action: grantPermissionRoleDto.action as actionEnum,
      }),
    ]);

    if (!role || !permission) {
      return 'role or permission nor found';
    }

    const roleId = role.roleId;
    const permissionId = permission.permissionId;

    const checkExisted = await this.rolesPermissionsRepo
      .createQueryBuilder()
      .select()
      .where('role_id = :roleId', { roleId: roleId })
      .andWhere('permission_id = :permissionId', {
        permissionId: permissionId,
      })
      .getRawOne();

    if (checkExisted) {
      return 'this permission has exsited for this role';
    }

    return await this.rolesPermissionsRepo
      .createQueryBuilder()
      .insert()
      .into(RolesPermissionsEntity)
      .values({
        roleId: { roleId: roleId },
        permissionId: { permissionId: permissionId },
      })
      .execute();
  }

  async revokePermissionRole(revokePermissionRoleDto: RevokePermissionRoleDto) {
    const [role, permission] = await Promise.all([
      this.rolesRepo.findOneBy({ roleName: revokePermissionRoleDto.roleName }),
      this.permissionsRepo.findOneBy({
        module: revokePermissionRoleDto.module as moduleEnum,
        action: revokePermissionRoleDto.action as actionEnum,
      }),
    ]);

    if (!role || !permission) {
      return 'role or permission nor found';
    }

    const roleId = role.roleId;
    const permissionId = permission.permissionId;

    return await this.rolesPermissionsRepo
      .createQueryBuilder()
      .delete()
      .from(RolesPermissionsEntity)
      .where('role_id = :roleId AND permission_id = :permissionId', {
        roleId: roleId,
        permissionId: permissionId,
      })
      .execute();
  }
  // end
}
