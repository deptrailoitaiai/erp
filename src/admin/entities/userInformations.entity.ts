import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { FormsEntity } from "./forms.entity";

@Entity({ name: "user_informations" })
export class UserInformationsEntity {
    @PrimaryGeneratedColumn('uuid', { name: "information_id" })
    informationId: string;

    @OneToOne(() => UsersEntity, usersEntity => usersEntity.userInformationEntity)
    @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
    userId: UsersEntity;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "email", nullable: false, unique: true })
    email: string;
    
    @Column({ name: "role" , nullable: false })
    role: string;

    @Column({ name: "citizen_id", unique: true, nullable: true })
    citizenId: string;

    @Column({ name: "address", type: "text", nullable: true })
    address: string;

    @Column({ name: "probation", type: "boolean", nullable: false })
    probaton: boolean;

    @OneToMany(() => FormsEntity, formsEntity => formsEntity.informationId)
    formsEntity: FormsEntity[];
}
