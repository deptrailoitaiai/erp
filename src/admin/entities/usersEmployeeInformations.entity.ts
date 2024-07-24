import { Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { EmployeeInformationsEntity } from "./employeeInformations.entity";

@Entity({ name: "users_empoyeeInformations_mapping" })
export class UsersEmployeeInformationsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "user_employeeInformation_id"})
    userEmployeeInformationId: string;

    @ManyToOne(() => UsersEntity, usersEntity => usersEntity.usersEmployeeInformationsEntity)
    @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
    userId: UsersEntity;

    @ManyToOne(() => EmployeeInformationsEntity, employeeInformationsEntity => 
        employeeInformationsEntity.usersEmployeeInformationsEntity)
    @JoinColumn({ name: "employee_id", referencedColumnName: "employeeId" })
    employeeId: EmployeeInformationsEntity;
}