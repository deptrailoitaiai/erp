import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormsEntity } from '../entities/forms.entity';
import { Repository } from 'typeorm';
import { OpenFormDto } from 'src/forms/dtos/openForm.dto';
import { UserInformationsEntity } from '../entities/userInformations.entity';
import { UserInformationsRepository } from './userInfomations.repository';
import { AnnualFormDto } from 'src/forms/dtos/annualFormSubmit.dto';
import { ProbationFormDto } from 'src/forms/dtos/probationFormSubmit.dto';
import { UsersFormsRepository } from './usersForms.repository';
import { UsersRepository } from './users.repository';
import { ApproveFormDto } from 'src/forms/dtos/approveForm.dto';

@Injectable()
export class FormsRepository {
  constructor(
    @InjectRepository(FormsEntity)
    private readonly formsRepo: Repository<FormsEntity>,
    private readonly userInformationRepo: UserInformationsRepository,
    private readonly usersFormsRepo: UsersFormsRepository,
    private readonly usersRepo: UsersRepository
  ) {}

  async formModuleOpenForm(openFormDto: OpenFormDto) {
    if (openFormDto.formType == 'Annual') {
      const getInfor =
        await this.userInformationRepo.formsModuleOpenFormAnnualGetInformationPresave();
      return await this.formsRepo.save(
        getInfor.map((i) =>
          this.formsRepo.create({
            formType: openFormDto.formType,
            createBy: { userId: 'fbwqkr' },
            informationId: i,
          }),
        ),
      );
    }

    if (openFormDto.formType == 'Probation') {
      const getInfor =
        await this.userInformationRepo.formsModuleOpenFormProbationGetInformationPresave();
      return await this.formsRepo.save(
        getInfor.map((i) =>
          this.formsRepo.create({
            formType: openFormDto.formType,
            createBy: { userId: 'fbwqkr' },
            informationId: i,
          }),
        ),
      );
    }
  }

  async formModuleSendAllEmailGetMailAndFormId(formType: string) {
    return await this.formsRepo
      .createQueryBuilder('fs')
      .leftJoin(
        UserInformationsEntity,
        'uis',
        'uis.information_id = fs.information_id',
      )
      .select('uis.email', 'email')
      .addSelect('fs.form_id', 'formId')
      .where('fs.form_type = :formType', { formType: formType })
      .andWhere('fs.performance IS NULL')
      .andWhere('fs.productivity IS NULL')
      .getRawMany();
  }

  async formModuleSendSpecificEmailGetMailAndFormId(
    formType: string,
    emails: string[],
  ) {
    return await this.formsRepo
      .createQueryBuilder('fs')
      .leftJoin(
        UserInformationsEntity,
        'uis',
        'uis.information_id = fs.information_id',
      )
      .select('uis.email', 'email')
      .addSelect('fs.form_id', 'formId')
      .where('fs.form_type = :formType', { formType: formType })
      .andWhere('uis.email IN (:...emails)', { emails: emails })
      .getRawMany();
  }

  async formModuleSendResubmitEmailGetMailAndFormId() {
    return await this.formsRepo
    .createQueryBuilder('fs')
    .leftJoin(
      UserInformationsEntity,
      'uis',
      'uis.information_id = fs.information_id',
    )
    .select('uis.email', 'email')
    .addSelect('fs.form_id', 'formId')
    .where('fs.superior_opinion = :reject', { reject: "reject" })
    .getRawMany();
  }

  async formModuleSubmitAnnualForm(annualFormDto: AnnualFormDto, formId: string) {
    const submitForm = await this.formsRepo.createQueryBuilder()
      .update(FormsEntity)
      .set({ 
        achievement: annualFormDto.achievement,
        performance: annualFormDto.performance,
        productivity: annualFormDto.productivity,
        userOpinion: annualFormDto.userOpinion,
        superiorOpinion: null,
        total: null,
      })
      .where('form_id = :formId', { formId: formId })
      .execute();

    await this.formModuleSubmitFormAfterSave(formId);
    return 
  }

  async formModuleSubmitProbationForm(probationFormDto: ProbationFormDto, formId: string) {
    const submitForm = await this.formsRepo.createQueryBuilder()
    .update(FormsEntity)
    .set({ 
      performance: probationFormDto.performance,
      productivity: probationFormDto.productivity,
      userOpinion: probationFormDto.userOpinion,
      superiorOpinion: null,
      total: null,
    })
    .where('form_id = :formId', { formId: formId })
    .execute();

    await this.formModuleSubmitFormAfterSave(formId);
    return
  }

  async formModuleSubmitFormAfterSave(formId: string) {
    const checkExisted = await this.usersFormsRepo.formModuleSubmitFormAfterSaveCheckExisted(formId);
    if(checkExisted) return

    const roleSubmiter = await this.userInformationRepo.formModuleSubmitFormAfterSaveGetRoleSubmiter(formId);
    
    const getSuperiorId = await this.usersRepo.formModuleSubmitFormAfterSaveGetSuperiorId(roleSubmiter);

    const formSubmitTo = await this.usersFormsRepo.formModuleSubmitFormAfterSaveSubmitTo(getSuperiorId, formId);
    return
  }

  async formModuleGetEmailNotSubmitForm(formType: string) {
    return await this.formsRepo
    .createQueryBuilder('fs')
    .leftJoin(
      UserInformationsEntity,
      'uis',
      'uis.information_id = fs.information_id',
    )
    .select('uis.email', 'email')
    .where('fs.form_type = :formType', { formType: formType })
    .andWhere('fs.performance IS NULL')
    .andWhere('fs.productivity IS NULL')
    .getRawMany();
  }

  async formModuleGetFormSubmited() {
    const getListForm = await this.formsRepo.createQueryBuilder('fs')
      .leftJoin(UserInformationsEntity, 'uis', 'uis.information_id = fs.information_id')
      .select('fs.form_id', 'formId')
      .addSelect('uis.email', 'email')
      .addSelect('uis.year', 'year')
      .addSelect('uis.achievement', 'achievement')
      .addSelect('uis.performance', 'performance')
      .addSelect('uis.productivity', 'productivity')
      .addSelect('uis.superior_opinion', 'superiorOpinion')
      .addSelect('uis.total', 'total')
      .getMany();
    return getListForm;
  }

  async formModuleApproveForm(approveFormDto: ApproveFormDto) {
    const approveForm = await this.formsRepo.createQueryBuilder()
      .update(FormsEntity)
      .set({
        superiorOpinion: approveFormDto.superiorOpinion,
        total: approveFormDto.total
      })
      .execute()
    
    return approveForm
  }
}
