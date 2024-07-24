import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesUsersEntity } from "./rolesUsers.entity";
import { RolesPermissionsEntity } from "./rolesPermissions.entity";

@Entity({ name: "roles" })
export class RolesEntity {
    @PrimaryGeneratedColumn("uuid", { name: "role_id" })
    roleId: string;

    @Column({ name: "role_name", nullable: false })
    roleName: string;

    @OneToMany(() => RolesUsersEntity, rolesUsersEntity => rolesUsersEntity.roleId)
    rolesUsersEntity: RolesUsersEntity[];

    @OneToMany(() => RolesPermissionsEntity, rolesPermissionsEntity => rolesPermissionsEntity.roleId)
    rolesPermissionsEntity: RolesPermissionsEntity[];
}