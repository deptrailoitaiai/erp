import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesUsersEntity } from "./rolesUsers.entity";
import { FormsEntity } from "./forms.entity";
import { UsersFormsEntity } from "./usersForms.entity";
import { UsersEmployeeInformationsEntity } from "./usersEmployeeInformations.entity";

@Entity({ name: "users" })
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid', { name: "user_id" })
    userId: string; 
    
    @Column({ name: "user_name", nullable: false })
    userName: string; 

    @Column({ name: "user_email", unique: true, nullable: false })
    userEmail: string;

    @Column({ name: "user_password", unique: true, nullable: false })
    userPassword: string;

    @OneToMany(() => RolesUsersEntity, rolesUsersEntity => rolesUsersEntity.userId)
    rolesUsersEntity: RolesUsersEntity[];

    @OneToMany(() => UsersFormsEntity, usersFormsEntity => usersFormsEntity.userId)
    usersFormsEntity: UsersFormsEntity[];

    @OneToMany(() => FormsEntity, formsEntity => formsEntity.createBy)
    formsEntity: FormsEntity[];

    @OneToMany(() => UsersEmployeeInformationsEntity, usersEmployeeInformationsEntity =>
         usersEmployeeInformationsEntity.userId)
    usersEmployeeInformationsEntity: UsersEmployeeInformationsEntity[];
}