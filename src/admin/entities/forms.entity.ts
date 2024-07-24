import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { EmployeeInformationsEntity } from "./employeeInformations.entity";
import { UsersFormsEntity } from "./usersForms.entity";

export enum formTypeEnum {
    probation = "probation",
    annual = "annual",
}

@Entity({ name: "forms" })
@Check(`"performance" >=1 AND "performance" <= 10`)
@Check(`"total" >=1 AND "total" <=10`)
@Check(`"productivity" >= 1 AND "productivity" <= 10`)
export class FormsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "form_id" })
    formId: string;

    @Column({ name: "form_type", nullable: false , type: "enum", enum: formTypeEnum })
    formType: formTypeEnum;

    @CreateDateColumn({ name: "year", type: "datetime", nullable: false })
    year: Date;

    @Column({ name: "achievement", type: "text" })
    achievement: string;

    @Column({ name: "permformance", type: "tinyint" })
    performance: number;

    @Column({ name: "productivity", type: "tinyint"})
    productivity: number;

    @Column({ name: "employee_opinion", type: "text" })
    employeeOpinion: string;

    @Column({ name: "superior_opinion", type: "text" })
    superiorOpinion: string;

    @Column({ name: "total", type: "tinyint" })
    total: number;

    @OneToMany(() => UsersFormsEntity, usersFormsEntity => usersFormsEntity.formId, {
        // cascade: true
    })
    usersFormsEntity: UsersFormsEntity[];

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.formsEntity)
    @JoinColumn({ name: "create_by", referencedColumnName: "userId" })
    createBy: UsersEntity;

    @ManyToOne(() => EmployeeInformationsEntity, employeeInformationsEntity => employeeInformationsEntity.formsEntity)
    @JoinColumn({ name: "employee_id", referencedColumnName: "employeeId" })
    employeeId: EmployeeInformationsEntity;
}
