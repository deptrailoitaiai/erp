import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { RolesEntity } from '../entities/roles.entity';
import { RolesPermissionsEntity } from '../entities/rolesPermissions.entity';
import { PermissionsEntity } from '../entities/permissions.entity';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { FormsEntity } from '../entities/forms.entity';
import { EmployeeInformationsEntity } from '../entities/employeeInformations.entity';
import { AnnualFormDto } from '../dtos/annualForm.dto';
import { UsersFormsEntity } from '../entities/usersForms.entity';
import { ProbationFormDto } from '../dtos/probationForm.dto';
import { SaveInformationDto } from 'src/employee-information/dtos/ei.dto';
import { AfterSaveRepository } from './afterSave.repository';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepo: Repository<PermissionsEntity>,
    @InjectRepository(RolesUsersEntity)
    private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    @InjectRepository(RolesPermissionsEntity)
    private readonly rolesPermissionsRepo: Repository<RolesPermissionsEntity>,
    @InjectRepository(FormsEntity)
    private readonly formsRepo: Repository<FormsEntity>,
    @InjectRepository(EmployeeInformationsEntity)
    private readonly employeeInformationsRepo: Repository<EmployeeInformationsEntity>,
    @InjectRepository(UsersFormsEntity)
    private readonly usersFormsRepo: Repository<UsersFormsEntity>,
    private readonly afterSaveRepo: AfterSaveRepository,
  ) {}

  //get con tact to send email
  async getContactUserNotSubmit(formType: string) {
    let contacts: SelectQueryBuilder<EmployeeInformationsEntity>;
    if (formType == 'annual') {
      contacts = this.employeeInformationsRepo
        .createQueryBuilder('employeeInformations')
        .select('employeeInformations.email', 'email')
        .addSelect('employeeInformations.employee_id', 'id')
        .leftJoin(
          FormsEntity,
          'forms',
          'forms.employee_id = employeeInformations.employee_id',
        )
        .where('forms.form_type != :formType OR forms.form_type IS NULL', {
          formType: formType,
        });
    }

    if (formType == 'probation') {
      contacts = this.employeeInformationsRepo
        .createQueryBuilder('employeeInformations')
        .select('employeeInformations.email', 'email')
        .addSelect('employeeInformations.employee_id', 'id')
        .leftJoin(
          FormsEntity,
          'forms',
          'forms.employee_id = employeeInformations.employee_id',
        )
        .where(
          '(forms.form_type != :formType OR forms.form_type IS NULL) AND employeeInformations.probation = :probation',
          {
            probation: 1,
            formType: formType,
          },
        );
    }

    return await contacts.getRawMany();
  }

  async getSpecificContact(emails: string[]) {
    const contacts = this.employeeInformationsRepo
      .createQueryBuilder('employeeInformations')
      .select('employeeInformations.email', 'email')
      .addSelect('employeeInformations.employee_id', 'id')
      .where('employeeInformations.email IN (:...emails)', { emails: emails });

    return await contacts.getRawMany();
  }
  //end

  //submit annual form
  async submitForm(formDto: AnnualFormDto | ProbationFormDto, id: string) {
    let saveData: FormsEntity;
    console.log(formDto);
    if (formDto.formType == 'annual' && 'achievement' in formDto) {
      const getForm = await this.formsRepo
        .createQueryBuilder('forms')
        .select()
        .where('forms.form_type = :type', { type: formDto.formType })
        .andWhere('forms.employee_id = :id', { id: id })
        .getRawOne();

      console.log(getForm);
      if (getForm) {
        return await this.formsRepo
          .createQueryBuilder('forms')
          .update(FormsEntity)
          .set({
            achievement: formDto.achievement,
            performance: formDto.performance,
            productivity: formDto.productivity,
            employeeOpinion: formDto.employeeOpinion,
            superiorOpinion: null,
            total: null,
          })
          .where('forms.employee_id = :id', { id: id })
          .andWhere('forms.form_type = :type', { type: formDto.formType })
          .execute();
      }

      saveData = await this.formsRepo.save(
        this.formsRepo.create({
          formType: formDto.formType,
          employeeId: { employeeId: id },
          achievement: formDto.achievement,
          performance: formDto.performance,
          productivity: formDto.productivity,
          employeeOpinion: formDto.employeeOpinion,
        }),
      );
    }

    if (formDto.formType == 'probation') {
      const getForm = await this.formsRepo
        .createQueryBuilder('forms')
        .select()
        .where('forms.form_type = :type', { type: formDto.formType })
        .andWhere('forms.employee_id = :id', { id: id })
        .getRawOne();

      if (getForm) {
        return await this.formsRepo
          .createQueryBuilder('forms')
          .update(FormsEntity)
          .set({
            performance: formDto.performance,
            productivity: formDto.productivity,
            employeeOpinion: formDto.employeeOpinion,
            superiorOpinion: null,
            total: null,
          })
          .where('forms.employee_id = :id', { id: id })
          .andWhere('forms.form_type = :type', { type: formDto.formType })
          .execute();
      }
      saveData = await this.formsRepo.save(
        this.formsRepo.create({
          formType: formDto.formType,
          employeeId: { employeeId: id },
          performance: formDto.performance,
          productivity: formDto.productivity,
          employeeOpinion: formDto.employeeOpinion,
        }),
      );
    }
    
    const afterSave = this.afterSaveRepo.afterSaveFormUser(saveData.formId);

    return saveData;
  }
  //end

  async getForm() {
    const forms = await this.formsRepo
      .createQueryBuilder('forms')
      .select('forms.form_type', 'form_type')
      .addSelect('forms.year', 'year')
      .addSelect('forms.employee_id', 'employee_id')
      .addSelect('forms.achievement', 'achievement')
      .addSelect('forms.permformance', 'permformance')
      .addSelect('forms.productivity', 'productivity')
      .addSelect('forms.employee_opinion', 'employee_opinion')
      .addSelect('forms.superior_opinion', 'superior_opinion')
      .addSelect('forms.total', 'total')
      .where('forms.total IS NULL')
      .getRawMany();
    return forms;
  }

  async approveForm(
    reject: boolean,
    formId: string,
    superiorOpinion?: string,
    total?: number,
  ) {
    if (reject == true) {
      const reject = await this.formsRepo
        .createQueryBuilder('forms')
        .update(FormsEntity)
        .set({ superiorOpinion: 'reject form' })
        .where('forms.form_id = :id', { id: formId })
        .execute();
      return reject;
    }

    const approve = await this.formsRepo
      .createQueryBuilder('forms')
      .update(FormsEntity)
      .set({ superiorOpinion: superiorOpinion, total: total })
      .where('forms.form_id = :id', { id: formId })
      .execute();
    return approve;
  }

  // save and update information
  async saveEmployeeInformation(
    saveEmployeeInformation: SaveInformationDto,
    role: string,
    probation: boolean,
  ) {
    const checkInfor = await this.employeeInformationsRepo.findOneBy({
      email: saveEmployeeInformation.email,
    });

    if (!checkInfor) {
      const save = await this.employeeInformationsRepo.save(
        saveEmployeeInformation,
      );

      // after save
      const afterSave = this.afterSaveRepo.afterSaveEmployeeInformationUser(save); 
      //end
      return save;
    }

    const update = await this.employeeInformationsRepo
      .createQueryBuilder('eis')
      .update(EmployeeInformationsEntity)
      .set(saveEmployeeInformation)
      .where('eis.employee_id = :id', { id: checkInfor.employeeId })
      .execute();
  }
  // end

  // read all infor
  async readInformation() {
    return await this.employeeInformationsRepo
      .createQueryBuilder('eis')
      .select('eis.employee_id', 'employee_id')
      .addSelect('eis.name', 'name')
      .addSelect('eis.email', 'email')
      .addSelect('eis.role', 'role')
      .addSelect('eis.citizen_id', 'citizen_id')
      .addSelect('eis.address', 'address')
      .addSelect('IF(eis.probation = 1, True, False)', 'probation')
      .getRawMany();
  }
  // end

  // read own infor
  async readOwnInformation(email: string) {}
  // end
}
