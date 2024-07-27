import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesPermissionsEntity } from "./rolesPermissions.entity";

export enum moduleEnum {
    Probation = "Probation",
    Annual = "Annual",
    Information = "Information"
}

export enum actionEnum {
    Read = "Read",
    ReadAll = "ReadAll",
    Write = "Write",
    Update = "Update",
    Delete = "Delete",
    Approve = "Approve"
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