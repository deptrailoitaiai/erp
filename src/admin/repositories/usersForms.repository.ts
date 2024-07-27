import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersFormsEntity } from "../entities/usersForms.entity";
import { Repository } from "typeorm";
import { UsersEntity } from "../entities/users.entity";

@Injectable()
export class UsersFormsRepository {
    constructor(
        @InjectRepository(UsersFormsEntity)
        private readonly usersFormsRepo: Repository<UsersFormsEntity>,
    ) {}

    async formModuleSubmitFormAfterSaveCheckExisted(formId: string) {
        const checkExisted = await this.usersFormsRepo.createQueryBuilder()
            .where('form_id = :formId', { formId: formId })
            .getMany();
        
        if(checkExisted.length > 0) return true;
        return false;
    }

    async formModuleSubmitFormAfterSaveSubmitTo(superiorId: UsersEntity[], formId: string) {
        const formSubmitTo = await this.usersFormsRepo.save(
            superiorId.map(userId => this.usersFormsRepo.create({
                userId: userId,
                formId: { formId: formId }
            }))
        )
    }

    async formModuleGetFormSubmited() {
        
    }
}