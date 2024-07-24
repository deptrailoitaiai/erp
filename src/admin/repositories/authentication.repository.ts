import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { RolesEntity } from '../entities/roles.entity';
import { PermissionsEntity } from '../entities/permissions.entity';
import { RolesUsersEntity } from '../entities/rolesUsers.entity';
import { RolesPermissionsEntity } from '../entities/rolesPermissions.entity';
import { FormsEntity } from '../entities/forms.entity';
import { LoginDto } from 'src/authentication/dtos/login.dto';

@Injectable()
export class AuthenticationRepository {
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
  ) {}

  async login(loginDto: LoginDto) {
    const getInfor = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin(RolesUsersEntity, 'ru', 'ru.user_id = u.user_id')
  }
}
