import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { Repository } from 'typeorm';
import { RoleEnum, RolesEntity } from '../entities/roles.entity';
import { CreateUserDto } from '../dtos/users.dto';
import { RolesRepository } from './roles.repository';
import { UsersFormsRepository } from './usersForms.repository';
import { UserInformationsRepository } from './userInfomations.repository';

@Injectable()
export class RolesUsersRepository {
  constructor(
    @InjectRepository(RolesUsersEntity)
    private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    private readonly rolesRepo: RolesRepository,
    private readonly usersFormsRepo: UsersFormsRepository,
    private readonly userInformationsRepo: UserInformationsRepository
  ) {}

  async adminModuleCreateUserGetRoleId(roles: string) {
    const roleArray = roles.split(',');
    roleArray.push('Employee');

    const getRoleIds = await this.rolesRepo.adminModuleCreateUserGetRoleId(roles)
  
    const rolesIds = (getRoleIds).map((i) => i.roleId);
    console.log(getRoleIds);
    return rolesIds;
  }

  async adminModuleCreateUserGetDefaultRoleId() {
    const getRoleDefaultId = await this.rolesRepo.adminModuleCreateUserGetDefaultRoleId();
    return getRoleDefaultId.roleId.split(' ');
  }

  async adminModuleCreateUserSetRole(
    createUserDto: CreateUserDto,
    roleId: string[],
    userId: string,
  ) {
    const setRole = await this.rolesUsersRepo.save(
      roleId.map((i) =>
        this.rolesUsersRepo.create({
          userId: { userId: userId },
          roleId: { roleId: i },
        }),
      ),
    );
  }

  async adminModuleGrantRoleUserIfHr(userId: string) {
    const getRoleId =
      await this.rolesRepo.adminModuleGrantRoleUserIfHrGetRoleId();

    const grant = await this.rolesUsersRepo.save(
      this.rolesUsersRepo.create({
        userId: { userId: userId },
        roleId: { roleId: getRoleId },
      }),
    );
    return;
  }

  async adminModuleGrantRoleUserIfManager(userId: string) {
    const getRoleId =
      await this.rolesRepo.adminModuleGrantRoleUserIfManagerGetRoleId();

    const grant = await this.rolesUsersRepo.save(
      this.rolesUsersRepo.create({
        userId: { userId: userId },
        roleId: { roleId: getRoleId },
      }),
    );

    const grantFormSubmited =
      await this.usersFormsRepo.adminModuleGrantRoleUserIfManagerGrantFormSubmited(
        userId,
      );
    return;
  }

  async adminModuleRevokeRoleUserIfHr(userId: string) {
    const getRoleId = await this.rolesRepo.getRoleId("Hr");

    const revoke = await this.rolesUsersRepo
      .createQueryBuilder()
      .delete()
      .from(RolesUsersEntity)
      .where('role_id = :roleId', { roleId: getRoleId })
      .andWhere('user_id = :userId', { userId: userId })
      .execute();
      
    const updateUserInformation = await this.userInformationsRepo.adminModuleRevokeRoleUserDeleteRole(userId, "Hr");

    return;
  }

  async adminModuleRevokeRoleUserIfManagerOrDirector(userId: string, role: RoleEnum) {
    const getRoleId = await this.rolesRepo.getRoleId(role);

      const revoke = await this.rolesUsersRepo
      .createQueryBuilder()
      .delete()
      .from(RolesUsersEntity)
      .where('role_id = :roleId', { roleId: getRoleId })
      .andWhere('user_id = :userId', { userId: userId })
      .execute();

    const revokeApproveForm =
      await this.usersFormsRepo.adminModuleRevokeRoleUserRevokeApproveForm(
        userId,
      );

    const updateUserInformation = await this.userInformationsRepo.adminModuleRevokeRoleUserDeleteRole(userId, role);
    
    return;
  }
}
