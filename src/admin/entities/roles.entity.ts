import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesUsersEntity } from './rolesUsers.entity';
import { RolesPermissionsEntity } from './rolesPermissions.entity';

export enum RoleEnum {
  Employee = 'Employee',
  Manager = 'Manager',
  Hr = 'Hr',
  Director = 'Director',
  Admin = 'Admin',
}

@Entity({ name: 'roles' })
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'role_id' })
  roleId: string;

  @Column({ name: 'role_name', type: 'enum', enum: RoleEnum, nullable: false })
  roleName: RoleEnum;

  @OneToMany(
    () => RolesUsersEntity,
    (rolesUsersEntity) => rolesUsersEntity.roleId,
  )
  rolesUsersEntity: RolesUsersEntity[];

  @OneToMany(
    () => RolesPermissionsEntity,
    (rolesPermissionsEntity) => rolesPermissionsEntity.roleId,
  )
  rolesPermissionsEntity: RolesPermissionsEntity[];
}
