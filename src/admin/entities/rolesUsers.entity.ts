import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { RolesEntity } from "./roles.entity";

@Entity({ name: "roles_users_mapping" })
export class RolesUsersEntity {
    @PrimaryGeneratedColumn('uuid', { name: "role_user_id" })
    roleUserId: string;

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.rolesUsersEntity)
    @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
    userId: UsersEntity;

    @ManyToOne(() => RolesEntity, rolesEntity => rolesEntity.rolesUsersEntity)
    @JoinColumn({ name: "role_id", referencedColumnName: "roleId" })
    roleId: RolesEntity;
}