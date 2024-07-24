import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesPermissionsEntity } from "./rolesPermissions.entity";

export enum moduleEnum {
    probation = "probation",
    annual = "annual",
    information = "information"
}

export enum actionEnum {
    read = "read",
    readOwner = "readOwner",
    write = "write",
    update = "update",
    delete = "delete",
    approve = "approve"
}

@Entity({ name: "permissions" })
export class PermissionsEntity {
    @PrimaryGeneratedColumn("uuid", { name: "permission_id" })
    permissionId: string;

    @Column({ name: "module", type: "enum", enum: moduleEnum, nullable: false })
    module: moduleEnum;

    @Column({ name: "action", type: "enum", enum: actionEnum, nullable: false })
    action: actionEnum;

    @OneToMany(() => RolesPermissionsEntity, rolesPermissionsEntity => rolesPermissionsEntity.permissionId)
    rolesPermissionsEntity: RolesPermissionsEntity[];
}