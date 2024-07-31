import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInformationsEntity } from '../entities/userInformations.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { FormsEntity } from '../entities/forms.entity';
import { SaveInformationDto } from 'src/informations/dtos/saveInformation.dto';
import { UsersEntity } from '../entities/users.entity';
import { SetProbationDto } from '../dtos/setProbation.dto';

@Injectable()
export class UserInformationsRepository {
  constructor(
    @InjectRepository(UserInformationsEntity)
    private readonly userInformationsRepo: Repository<UserInformationsEntity>,
  ) {}

  async formsModuleOpenFormAnnualGetInformationPresave() {
    return await this.userInformationsRepo
      .createQueryBuilder()
      .where('probation = :boolean', { boolean: 0 })
      .getMany();
  }

  async formsModuleOpenFormProbationGetInformationPresave() {
    return await this.userInformationsRepo
      .createQueryBuilder()
      .where('probation = :boolean', { boolean: 1 })
      .getMany();
  }

  async formModuleSubmitFormAfterSaveGetRoleSubmiter(formId: string) {
    const getRoleSubmiter = await this.userInformationsRepo
      .createQueryBuilder('uis')
      .leftJoin(FormsEntity, 'fs', 'fs.information_id = uis.information_id')
      .select('uis.role')
      .where('fs.form_id = :formId', { formId: formId })
      .getOne();

    const role = getRoleSubmiter.role.split(',');
    return role;
  }

  async informationModuleSave(
    userId: string,
    saveInformationDto: SaveInformationDto,
  ) {
    const updateInformation = await this.userInformationsRepo
      .createQueryBuilder()
      .update(UserInformationsEntity)
      .set({
        citizenId: saveInformationDto.citizenId,
        address: saveInformationDto.address,
      })
      .where('user_id = :userId', { userId: userId })
      .execute();
    return updateInformation
  }

  async infomationModuleRead(userId: string) {
    const getInformation = await this.userInformationsRepo
      .createQueryBuilder()
      .select()
      .where('user_id = :userId', { userId: userId })
      .getRawOne();

    return getInformation;
  }

  async adminModuleCreateUserCreateUserInfor(usersEntity: UsersEntity, role: string) {
    const createUserInformation = await this.userInformationsRepo.save(this.userInformationsRepo.create({
      userId: { userId: usersEntity.userId },
      name: usersEntity.userName,
      email: usersEntity.userEmail,
      role: role === undefined ? "Employee": role+",Employee",
      probaton: true
    }))
  }

  async adminModuleDeleteUserGetInformationId(userId: string) {
    return await this.userInformationsRepo
     .createQueryBuilder()
     .select()
     .where('user_id = :userId', { userId: userId })
     .getOne();
  }

  async adminModuleSetProbation(setProbationDto: SetProbationDto) {
    const find = await this.userInformationsRepo.findOneBy({ email: setProbationDto.userEmail })
    if(!find) return 1

    if(Boolean(find.probaton) === setProbationDto.setProbation) return 2

    const update = await this.userInformationsRepo
      .createQueryBuilder()
      .update(UserInformationsEntity)
      .set({ probaton: setProbationDto.setProbation })
      .where('email = :email', { email: setProbationDto.userEmail })
      .execute()
    return update
  }

  async adminModuleRevokeRoleUserDeleteRole(userId: string, roleName: string) {
    const roleNameToArray = roleName.split(',')
    const getRole: { role: string } = await this.userInformationsRepo
      .createQueryBuilder()
      .select('role', 'role')
      .where('user_id = :userId', { userId: userId })
      .getRawOne()

    const roles = getRole.role.split(',')
    const newRole = roles.filter((p) => !roleNameToArray.includes(p))
    const update = await this.userInformationsRepo
      .createQueryBuilder()
      .update(UserInformationsEntity)
      .set({ role: newRole.join(',') })
      .where('user_id = :userId', { userId: userId })
      .execute(); 
  }

  async adminModuleGrantRoleUserAddRole(userId: string, roleName: string) {
    const getRole: { role: string } = await this.userInformationsRepo
      .createQueryBuilder()
      .select('role', 'role')
      .where('user_id = :userId', { userId: userId })
      .getRawOne()
    
    const update = await this.userInformationsRepo
      .createQueryBuilder()
      .update(UserInformationsEntity)
      .set({ role: getRole.role + `,${roleName}`})
      .where('user_id = :userId', { userId: userId })
      .execute();
  }
}
