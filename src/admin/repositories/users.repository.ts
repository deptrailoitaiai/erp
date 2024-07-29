import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { RolesEntity } from '../entities/roles.entity';
import { loginFormDto } from 'src/authentication/dto/loginForm.dto';
import { CreateUserDto, DeleteUserDto } from '../dtos/users.dto';
import { RolesUsersRepository } from './rolesUsers.repository';
import { get } from 'http';
import { UserInformationsRepository } from './userInfomations.repository';
import { UsersFormsRepository } from './usersForms.repository';
import { UserInformationsEntity } from '../entities/userInformations.entity';
import { UsersFormsEntity } from '../entities/usersForms.entity';
import { FormsEntity } from '../entities/forms.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @Inject(forwardRef(() => RolesUsersRepository))
    private readonly rolesUsersRepo: RolesUsersRepository,
    @Inject(forwardRef(() => UserInformationsRepository))
    private readonly userInformationRepo: UserInformationsRepository,
    @Inject(forwardRef(() => UsersFormsRepository))
    private readonly usersFormsRepo: UsersFormsRepository,
  ) {}
  async formModuleSubmitFormAfterSaveGetSuperiorId(role: string[]) {
    if (role.includes('Manager')) {
      const getDirectorId = await this.usersRepo
        .createQueryBuilder('u')
        .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = u.user_id')
        .leftJoin(RolesEntity, 'r', 'r.role_id = ru.role_id')
        .select('u.user_id', 'userId')
        .where('r.role_name = :Director', { Director: 'Director' })
        .getMany();
      return getDirectorId;
    }

    const getSuperiorId = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = u.user_id')
      .leftJoin(RolesEntity, 'r', 'r.role_id = ru.role_id')
      .select('u.user_id', 'userId')
      .where('r.role_name = :Hr', { Hr: 'Hr' })
      .orWhere('r.role_name = :Manager', { Manager: 'Manager' })
      .orWhere('r.role_name = :Director', { Director: 'Director' })
      .getMany();
    return getSuperiorId;
  }

  async authenticationModuleLogin(loginFormDto: loginFormDto) {
    const getEmailPassword = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoin(
        RolesUsersEntity,
        'rolesUsers',
        'rolesUsers.user_id = users.user_id',
      )
      .leftJoin(RolesEntity, 'roles', 'roles.role_id = rolesUsers.role_id')
      .select('users.user_id', 'userId')
      .addSelect('users.user_password', 'password')
      .addSelect('roles.role_name', 'role')
      .getRawMany();
    return getEmailPassword;
  }

  async adminModuleCreateUserCheckUserExists(createUserDto: CreateUserDto) {
    const getUser = await this.usersRepo.findOneBy({
      userEmail: createUserDto.userEmail,
    });
    if (!getUser.userEmail) return false;

    return true;
  }

  async adminModuleCreateUserSaveUser(createUserDto: CreateUserDto) {
    const save = await this.usersRepo.save(
      this.usersRepo.create({
        userName: createUserDto.userName,
        userEmail: createUserDto.userEmail,
        userPassword: createUserDto.userPassword,
      }),
    );
    return save;
  }

  async adminModuleCreateUserSetRole(
    createUserDto: CreateUserDto,
    userId: string,
    role?: string,
  ) {
    if (role) {
      const getRoleIds =
        await this.rolesUsersRepo.adminModuleCreateUserGetRoleId(role);
      const setRole = await this.rolesUsersRepo.adminModuleCreateUserSetRole(
        createUserDto,
        getRoleIds,
        userId,
      );
      return;
    }

    const getDefaultRoleId =
      await this.rolesUsersRepo.adminModuleCreateUserGetDefaultRoleId();
    const setRole = await this.rolesUsersRepo.adminModuleCreateUserSetRole(
      createUserDto,
      getDefaultRoleId,
      userId,
    );
    return;
  }

  async adminModuleDeleteUser(deleteUserDto: DeleteUserDto) {
    const findUser = await this.usersRepo.findOneBy({
      userEmail: deleteUserDto.userEmail,
    });
    if (!findUser) return 'user not found';
    // Xóa từ bảng UsersFormsEntity
    await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(UsersFormsEntity, 'ufs', 'ufs.user_id = us.user_id')
      .delete()
      .from(UsersFormsEntity)
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    // Xóa từ bảng UserInformationsEntity
    await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(UserInformationsEntity, 'uis', 'uis.user_id = us.user_id')
      .delete()
      .from(UserInformationsEntity)
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    // Xóa từ bảng RolesUsersEntity
    await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = us.user_id')
      .delete()
      .from(RolesUsersEntity)
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    // Xóa từ bảng FormsEntity với thông tin được tạo bởi user
    await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(FormsEntity, 'fsus', 'fsus.create_by = us.user_id')
      .update(FormsEntity)
      .set({ createBy: { userId: null }})
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    // Xóa từ bảng FormsEntity với thông tin được liên kết qua UserInformationsEntity
    await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(UserInformationsEntity, 'uis', 'uis.user_id = us.user_id')
      .leftJoin(
        FormsEntity,
        'fsuis',
        'fsuis.information_id = uis.information_id',
      )
      .delete()
      .from(FormsEntity)
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    // Cuối cùng, xóa từ bảng UsersEntity
    await this.usersRepo
      .createQueryBuilder('us')
      .delete()
      .from(UsersEntity)
      .where('us.user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    return
  }
}
