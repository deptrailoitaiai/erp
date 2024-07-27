import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInformationsEntity } from '../entities/userInformations.entity';
import { Repository } from 'typeorm';
import { truncate } from 'fs';
import { FormsEntity } from '../entities/forms.entity';
import { SaveInformationDto } from 'src/informations/dtos/saveInformation.dto';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UserInformationsRepository {
  constructor(
    @InjectRepository(UserInformationsEntity)
    private readonly userInformationsRepo: Repository<UserInformationsEntity>,
  ) {}

  async formsModuleOpenFormAnnualGetInformationPresave() {
    return await this.userInformationsRepo
      .createQueryBuilder()
      .where('probation = :boolean', { boolean: false })
      .getMany();
  }

  async formsModuleOpenFormProbationGetInformationPresave() {
    return await this.userInformationsRepo
      .createQueryBuilder()
      .where('probation = :boolean', { boolean: true })
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
}
