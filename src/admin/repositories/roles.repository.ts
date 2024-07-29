import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEnum, RolesEntity } from "../entities/roles.entity";
import { Repository } from "typeorm";
import { RolesUsersEntity } from "../entities/rolesUsers.entity";
import { UsersEntity } from "../entities/users.entity";

@Injectable()
export class RolesRepository {
    constructor(
        @InjectRepository(RolesEntity)
        private readonly rolesRepo: Repository<RolesEntity>
    ) {}

    async adminModuleCreateRole(roleName: string) {
        const createRole = await this.rolesRepo.save(this.rolesRepo.create({
            roleName: roleName as RoleEnum,
        }))
        return createRole;
    }

    async adminModuleGrantRevokeRoleUserGetRole(userEmail: string) {
        const getRoles = await this.rolesRepo
            .createQueryBuilder('rs')
            .leftJoin(RolesUsersEntity, 'ru', 'ru.role_id = rs.role_id')
            .leftJoin(UsersEntity, 'us', 'us.user_id = ru.user_id')
            .select('rs.role_name', 'roleName')
            .addSelect('us.user_id', 'userId')
            .addSelect('us.user_email', 'userEmail')
            .where('us.user_email = :userEmail' , { userEmail: userEmail })
            .getRawMany();

        return getRoles
    }

    async adminModuleGrantRoleUserIfHrGetRoleId() {
        const roleId = await this.rolesRepo.findOneBy({ roleName: "Hr" as RoleEnum })
        return roleId.roleId;
    }

    async adminModuleGrantRoleUserIfManagerGetRoleId() {
        const roleId = await this.rolesRepo.findOneBy({ roleName: "Manager" as RoleEnum })
        return roleId.roleId;
    }
}