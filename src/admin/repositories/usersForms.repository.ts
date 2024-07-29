import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersFormsEntity } from "../entities/usersForms.entity";
import { Repository } from "typeorm";
import { UsersEntity } from "../entities/users.entity";
import { FormsRepository } from "./forms.repository";

@Injectable()
export class UsersFormsRepository {
    constructor(
        @InjectRepository(UsersFormsEntity)
        private readonly usersFormsRepo: Repository<UsersFormsEntity>,
        @Inject(forwardRef(() => FormsRepository))
        private readonly formsRepo: FormsRepository,
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

    async adminModuleCreateUserGrantFormSubmited(userId: string, submitedFormId: string[]) {
        const grant = await this.usersFormsRepo.save(submitedFormId.map(i => this.usersFormsRepo.create({
            userId: { userId: userId },
            formId: { formId: i }
        })))
    }

    async adminModuleDeleteUserDeleteUsersFormsSubmitted(userId: string) {
        const deleteUsersForms = await this.usersFormsRepo
            .createQueryBuilder()
            .delete()
            .from(UsersFormsEntity)
            .where('user_id = :userId', { userId: userId })
            .execute();
    }

    async adminModuleGrantRoleUserIfManagerGrantFormSubmited(userId: string) {
        const formIds = await this.formsRepo.adminModuleCreateDeleteUserGetIdFormSubmited();
        const grant = await this.usersFormsRepo.save(formIds.map(i => this.usersFormsRepo.create({
            userId: { userId: userId },
            formId: { formId: i }
        })))
    }

    async adminModuleRevokeRoleUserRevokeApproveForm(userId: string) {
        const revoke = await this.usersFormsRepo
            .createQueryBuilder()
            .delete()
            .from(UsersFormsEntity)
            .where('user_id = :userId', { userId: userId })
            .execute();
    }
}