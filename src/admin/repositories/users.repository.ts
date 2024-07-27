import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { RolesEntity } from '../entities/roles.entity';
import { loginFormDto } from 'src/authentication/dto/loginForm.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
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
      .orWhere('r.role_name = :Manager', { Manager: "Manager" })
      .orWhere('r.role_name = :Director', { Director: "Director" })
      .getMany();
    return getSuperiorId;
  }
 
  async authenticationModuleLogin(loginFormDto: loginFormDto) {
    const getEmailPassword = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoin(RolesUsersEntity, 'rolesUsers', 'rolesUsers.user_id = users.user_id')
      .leftJoin(RolesEntity, 'roles', 'roles.role_id = rolesUsers.role_id')
      .select('users.user_id', 'userId')
      .addSelect('users.user_password', 'password')
      .addSelect('roles.role_name', 'role')
      .getRawMany();
    return getEmailPassword;
  }
}
