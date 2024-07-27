import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FormsEntity } from "./forms.entity";

@Entity({ name: "users_form_submited"})
export class UsersFormsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "users_forms_id" })
    usersFormsId: string

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.usersFormsEntity)
    @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
    userId: UsersEntity;

    @ManyToOne(() => FormsEntity, formsEntity => formsEntity.usersFormsEntity)
    @JoinColumn({ name: "information_id" ,referencedColumnName: "informationId" })
    formId: FormsEntity;

}