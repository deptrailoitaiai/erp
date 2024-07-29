import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { Repository } from 'typeorm';
import { RoleEnum, RolesEntity } from '../entities/roles.entity';
import { CreateUserDto } from '../dtos/users.dto';
import { RolesRepository } from './roles.repository';
import { UsersFormsRepository } from './usersForms.repository';

@Injectable()
export class RolesUsersRepository {
  constructor(
    @InjectRepository(RolesUsersEntity)
    private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    private readonly rolesRepo: RolesRepository,
    private readonly usersFormsRepo: UsersFormsRepository,
  ) {}

  async adminModuleCreateUserGetRoleId(roles: string) {
    const roleArray = roles.split(',');
    roleArray.push('Employee');

    const getRoleIds = await this.rolesUsersRepo
      .createQueryBuilder('ru')
      .leftJoin(RolesEntity, 'rs', 'rs.role_id = ru.role_id')
      .select('ru.role_id', 'roleId')
      .where('rs.role_name = (:...roleName)', { roleName: roleArray })
      .getRawMany();
    const rolesIds = getRoleIds.map((i) => i.roleId);
    return rolesIds;
  }

  async adminModuleCreateUserGetDefaultRoleId() {
    const getRoleDefaultId: { roleId: string } = await this.rolesUsersRepo
      .createQueryBuilder('ru')
      .leftJoin(RolesEntity, 'rs', 'rs.role_id = ru.role_id')
      .select('ru.role_id', 'roleId')
      .where('rs.role_name = :Employee', { Employee: 'Employee' })
      .getRawOne();
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
    const revoke = await this.rolesUsersRepo
      .createQueryBuilder('ru')
      .leftJoin(RolesEntity, 'rs', 'rs.role_id = ru.role_id')
      .delete()
      .from(RolesUsersEntity)
      .where('rs.role_name = :Hr', { Hr: 'Hr' })
      .execute();

    return;
  }

  async adminModuleRevokeRoleUserIfManagerOrDirector(userId: string, role: RoleEnum) {
    const revoke = await this.rolesUsersRepo
      .createQueryBuilder('ru')
      .leftJoin(RolesEntity, 'rs', 'rs.role_id = ru.role_id')
      .delete()
      .from(RolesUsersEntity)
      .where('rs.role_name = :role', { role: role })
      .execute();

    const revokeApproveForm =
      await this.usersFormsRepo.adminModuleRevokeRoleUserRevokeApproveForm(
        userId,
      );
    
    return;
  }
}
