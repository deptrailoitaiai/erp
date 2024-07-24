import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FormsEntity } from "./forms.entity";
import { UsersEntity } from "./users.entity";
import { UsersEmployeeInformationsEntity } from "./usersEmployeeInformations.entity";

@Entity({ name: "employee_informations" })
export class EmployeeInformationsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "employee_id" })
    employeeId: string;

    @Column({ name: "name", nullable: false })
    name: string;

    @Column({ name: "email", nullable: false, unique: true })
    email: string;

    @Column({ name: "role", nullable: false })
    role: string;

    @Column({ name: "citizen_id", nullable: false, unique: true })
    citizenId: string;

    @Column({ name: "address", type: "text" })
    address: string;

    @Column({ name: "probation", type: "boolean" })
    probation: boolean;

    @OneToMany(() => UsersEmployeeInformationsEntity, usersEmployeeInformationsEntity => 
        usersEmployeeInformationsEntity.employeeId)
    usersEmployeeInformationsEntity: UsersEmployeeInformationsEntity[];

    @OneToMany(() => FormsEntity, formsEntity => formsEntity.employeeId)
    formsEntity: FormsEntity[];
}