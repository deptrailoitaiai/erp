import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FormsEntity } from "./forms.entity";

@Entity({ name: "users_forms_mapping" })
export class UsersFormsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "users_forms_id" })
    usersFormsSubmitedId: string;

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.usersFormsEntity)
    @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
    userId: UsersEntity;

    @ManyToOne(() => FormsEntity, formsEntity => formsEntity.usersFormsEntity)
    @JoinColumn({ name: "form_id", referencedColumnName: "formId"})
    formId: FormsEntity;
}