import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";
import { PermissionsEntity } from "./permissions.entity";

@Entity({ name: "roles_permissions_mapping" })
export class RolesPermissionsEntity {
    @PrimaryGeneratedColumn("uuid", { name: "role_permission_id" })
    rolePermissionsId: string;

    @ManyToOne(() => RolesEntity, rolesEntity => rolesEntity.rolesPermissionsEntity)
    @JoinColumn({ name: "role_id", referencedColumnName: "roleId" })
    roleId: RolesEntity;

    @ManyToOne(() => PermissionsEntity, permissionsEntity => permissionsEntity.rolesPermissionsEntity)
    @JoinColumn({ name: "permission_id", referencedColumnName: "permissionId" })
    permissionId: PermissionsEntity;
}