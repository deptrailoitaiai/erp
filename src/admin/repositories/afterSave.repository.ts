import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { FormsEntity } from '../entities/forms.entity';
import { EmployeeInformationsEntity } from '../entities/employeeInformations.entity';
import { UsersFormsEntity } from '../entities/usersForms.entity';
import { CreateUserDto } from '../dtos/admin.users.dto';
import { RolesEntity } from '../entities/roles.entity';
import { PermissionsEntity } from '../entities/permissions.entity';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { RolesPermissionsEntity } from '../entities/rolesPermissions.entity';
import { UsersEmployeeInformationsEntity } from '../entities/usersEmployeeInformations.entity';

@Injectable()
export class AfterSaveRepository {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepo: Repository<RolesEntity>,
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepo: Repository<PermissionsEntity>,
    @InjectRepository(RolesUsersEntity)
    private readonly rolesUsersRepo: Repository<RolesUsersEntity>,
    @InjectRepository(RolesPermissionsEntity)
    private readonly rolesPermissionsRepo: Repository<RolesPermissionsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @InjectRepository(FormsEntity)
    private readonly formsRepo: Repository<FormsEntity>,
    @InjectRepository(EmployeeInformationsEntity)
    private readonly employeeInformationsRepo: Repository<EmployeeInformationsEntity>,
    @InjectRepository(UsersFormsEntity)
    private readonly usersFormsRepo: Repository<UsersFormsEntity>,
    @InjectRepository(UsersEmployeeInformationsEntity)
    private readonly usersEmployeeInformationsRepo: Repository<UsersEmployeeInformationsEntity>,
  ) {}

  async afterSaveUserForm(newUser: UsersEntity) {
    const getRole = await this.rolesRepo
      .createQueryBuilder('r')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.role_id = r.role_id')
      .leftJoin(UsersEntity, 'u', 'u.user_id = ru.user_id')
      .select('r.role_name', 'role')
      .addSelect('u.user_id', 'userId')
      .where('u.user_email = :userEmail', { userEmail: newUser.userEmail })
      .getRawOne();

    if (getRole.role == 'Director' || getRole.role == 'Mannager') {
      const getForms = await this.formsRepo.createQueryBuilder().getMany();

      return await this.usersFormsRepo.save(
        getForms.map((i) =>
          this.usersFormsRepo.create({
            userId: getRole.userId,
            formId: i,
          }),
        ),
      );
    }

    const getForms = await this.formsRepo
      .createQueryBuilder('fs')
      .leftJoin(
        EmployeeInformationsEntity,
        'eis',
        'eis.employee_id = fs.employee_id',
      )
      .select('fs.form_id', 'id')
      .where('eis.email =: email', { email: newUser.userEmail })
      .getOne();

    return await this.usersFormsRepo.save(
      this.usersFormsRepo.create({
        userId: newUser,
        formId: getForms,
      }),
    );
  }

  async afterSaveUserEmployeeInformation(newUser: UsersEntity) {
    const getRole = await this.rolesRepo
      .createQueryBuilder('r')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.role_id = r.role_id')
      .leftJoin(UsersEntity, 'u', 'u.user_id = ru.user_id')
      .select('r.role_name', 'role')
      .addSelect('u.user_id', 'userId')
      .where('u.user_email = :userEmail', { userEmail: newUser.userEmail })
      .getRawOne();

    if (getRole.role == 'Director' || getRole.role == 'Hr') {
      const getInfor = await this.employeeInformationsRepo
        .createQueryBuilder()
        .getMany();

      return await this.usersEmployeeInformationsRepo.save(
        getInfor.map((i) =>
          this.usersEmployeeInformationsRepo.create({
            userId: getRole.userId,
            employeeId: i,
          }),
        ),
      );
    }

    const getInfor = await this.employeeInformationsRepo.findOneBy({
      email: newUser.userEmail,
    });

    return await this.usersEmployeeInformationsRepo.save(
      this.usersEmployeeInformationsRepo.create({
        userId: newUser,
        employeeId: getInfor,
      }),
    );
  }

  async afterSaveFormUser(formId: string) {
    const ownerEmail = await this.employeeInformationsRepo.createQueryBuilder('eis')
      .leftJoin(FormsEntity, 'f', 'f.employee_id = eis.employee_id')
      .select('eis.email', 'email')
      .where('f.form_id = :formId', { formId: formId })
      .getRawOne();

    const getSuperiorIdsQuery = this.usersRepo
      .createQueryBuilder('users')
      .leftJoin(
        RolesUsersEntity,
        'rolesUsers',
        'rolesUsers.user_id = users.user_id',
      )
      .leftJoin(RolesEntity, 'roles', 'roles.role_id = rolesUsers.role_id')
      .where('roles.role_name = :Director OR roles.role_name = :Manager OR users.email =: email', {
        Director: 'Director',
        Manager: 'Manager',
        email: ownerEmail.email,
      });
    // console.log(getSuperiorIdsQuery.getQueryAndParameters());

    const managers = await getSuperiorIdsQuery.getMany();

    const form = await this.formsRepo.findOneBy({
      formId: formId,
    });

    await this.usersFormsRepo.save(
      managers.map((i) =>
        this.usersFormsRepo.create({
          userId: i,
          formId: form,
        }),
      ),
    );
  }

  async afterSaveEmployeeInformationUser(employeeInformation: EmployeeInformationsEntity) {
    const getUserIds = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = u.user_id')
      .leftJoin(RolesEntity, 'r', 'r.role_id = ru. role_id')
      .select('u.user_email', 'email')
      .where('r.role_name = :Hr OR r.role_name = :Director OR u.email = :email', {
        Hr: 'Hr',
        Director: 'Director',
        email: employeeInformation.email,
      })
      .getMany();

    return await this.usersEmployeeInformationsRepo.save(
      getUserIds.map((i) => this.usersEmployeeInformationsRepo.create({
        userId: i,
        employeeId: employeeInformation,
      }))
    )
  }
}
