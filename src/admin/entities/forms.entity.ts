import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { UserInformationsEntity } from "./userInformations.entity";
import { UsersFormsEntity } from "./usersForms.entity";

export enum FormTypeEnum {
    Probation = "Probation",
    Annual = "Annual"
}

@Entity({ name: "forms" })
export class FormsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "form_id" })
    formId: string;

    @Column({ name: "form_type", type: "enum", enum: FormTypeEnum, nullable: false })
    formType: FormTypeEnum;

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.formsEntity)
    @JoinColumn({ name: "create_by", referencedColumnName: "userId" })
    createBy: UsersEntity;

    @ManyToOne(() => UserInformationsEntity, userInformationsEntity => userInformationsEntity.formsEntity)
    @JoinColumn({ name: "information_id", referencedColumnName: "informationId" })
    informationId: UserInformationsEntity;

    // @Column({ name: "year", type: "date" })
    @CreateDateColumn({ name: "year" })
    year: Date;

    @Column({ name: "achievement", type: "text", nullable: true })
    achievement: string;

    @Column({ name: "performance", type: "tinyint", nullable: true })
    performance: number;

    @Column({ name: "productivity", type: "tinyint", nullable: true })
    productivity: number;

    @Column({ name: "user_opinion", type: "text", nullable: true })
    userOpinion: string;

    @Column({ name: "superior_opinion", type: "text", nullable: true })
    superiorOpinion: string;

    @Column({ name: "total", type: "tinyint", nullable: true })
    total: number;

    @OneToMany(() => UsersFormsEntity, usersFormsEntity => usersFormsEntity.formId)
    usersFormsEntity: UsersFormsEntity[];
}