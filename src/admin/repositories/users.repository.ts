import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { getConnection, Repository } from 'typeorm';
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
      .where('r.role_name = :Manager', { Manager: 'Manager' })
      .orWhere('r.role_name = :Director', { Director: 'Director' })
      .getRawMany();
    return getSuperiorId.map((i) => i.userId);
  }

  async authenticationModuleLogin(loginFormDto: loginFormDto) {
    const getEmailPassword = await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = us.user_id')
      .leftJoin(RolesEntity, 'rs', 'rs.role_id = ru.role_id')
      .select('us.user_id', 'userId')
      .addSelect('us.user_password', 'password')
      .addSelect('rs.role_name', 'role')
      .where('us.user_email = :userEmail', { userEmail: loginFormDto.email });
    console.log(getEmailPassword.getQueryAndParameters());
    return await getEmailPassword.getRawMany();
  }

  async adminModuleCreateUserCheckUserExists(createUserDto: CreateUserDto) {
    const getUser = await this.usersRepo.findOneBy({
      userEmail: createUserDto.userEmail,
    });
    if (!getUser) return false;

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
    const a = await this.usersRepo
      .createQueryBuilder('us')
      .delete()
      .from(UsersFormsEntity)
      .where('user_Id = :userId', {
        userId: findUser.userId,
      })
      .execute();

    // Xóa từ bảng UserInformationsEntity
    const informationId =
      await this.userInformationRepo.adminModuleDeleteUserGetInformationId(
        findUser.userId,
      );
    console.log(informationId);

    const b = await this.usersRepo
      .createQueryBuilder()
      .delete()
      .from(UserInformationsEntity)
      .where('user_id = :userId', {
        userId: findUser.userId,
      })
      .execute();

    // Xóa từ bảng RolesUsersEntity
    const c = await this.usersRepo
      .createQueryBuilder()
      .delete()
      .from(RolesUsersEntity)
      .where('user_id = :userId', {
        userId: findUser.userId,
      })
      .execute();

    // Xóa từ bảng FormsEntity với thông tin được tạo bởi user
    const d = await this.usersRepo
      .createQueryBuilder()
      .update(FormsEntity)
      .set({ createBy: { userId: null } })
      .where('informationId = :informationId', {
        informationId: informationId.informationId,
      });
    await d.execute();

    // Xóa từ bảng FormsEntity với thông tin được liên kết qua UserInformationsEntity
    const e = await this.usersRepo
      .createQueryBuilder()
      .delete()
      .from(FormsEntity)
      .where('information_id = :informationId', {
        informationId: informationId.informationId,
      })
      .execute();

    // Cuối cùng, xóa từ bảng UsersEntity
    const f = await this.usersRepo
      .createQueryBuilder()
      .delete()
      .from(UsersEntity)
      .where('user_email = :userEmail', {
        userEmail: deleteUserDto.userEmail,
      })
      .execute();

    return 'deteted';
  }

  async adminModuleReadUser() {
    const a = await this.usersRepo
      .createQueryBuilder('us')
      .leftJoin(UserInformationsEntity, 'uis', 'uis.user_id = us.user_id')
      .select('us.user_id', 'userId')
      .addSelect('us.user_email', 'userEmail')
      .addSelect('uis.role', 'role')
      .getRawMany();

    return (a.map((p) => {return {
      userId: p.userId,
      userEmail: p.userEmail,
      role: p.role
    }}))
  }
}
