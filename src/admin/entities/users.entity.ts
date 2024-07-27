import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolesUsersEntity } from "./rolesUsers.entity";
import { UsersFormsEntity } from "./usersForms.entity";
import { FormsEntity } from "./forms.entity";
import { UserInformationsEntity } from "./userInformations.entity";

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

    @OneToOne(() => UserInformationsEntity, userInformationEntity => userInformationEntity.userId)
    userInformationEntity: UserInformationsEntity;
}