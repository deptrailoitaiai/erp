import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './services/admin.service';
import { UsersEntity } from './entities/users.entity';
import { RolesUsersEntity } from './entities/rolesUsers.entity';
import { RolesEntity } from './entities/roles.entity';
import { RolesPermissionsEntity } from './entities/rolesPermissions.entity';
import { PermissionsEntity } from './entities/permissions.entity';
import { FormsEntity } from './entities/forms.entity';
import { UserInformationsEntity } from './entities/userInformations.entity';
import { AdminController } from './admin.controller';
import { UsersFormsEntity } from './entities/usersForms.entity';
import { FormsRepository } from './repositories/forms.repository';
import { UserInformationsRepository } from './repositories/userInfomations.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersFormsRepository } from './repositories/usersForms.repository';
import { RolesUsersRepository } from './repositories/rolesUsers.repository';
import { RolesRepository } from './repositories/roles.repository';
import { PermissionsRepository } from './repositories/permission.repository';
import { RolesPermissionsRepository } from './repositories/rolesPermissions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      RolesUsersEntity,
      RolesEntity,
      RolesPermissionsEntity,
      PermissionsEntity,
      FormsEntity,
      UserInformationsEntity,
      UsersFormsEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    FormsRepository,
    UserInformationsRepository,
    UsersRepository,
    UsersFormsRepository,
    RolesUsersRepository,
    RolesRepository,
    PermissionsRepository,
    RolesPermissionsRepository
  ],
  exports: [
    FormsRepository,
    UserInformationsRepository,
    UsersRepository,
    UsersFormsRepository,
    UsersFormsRepository
  ],
})
export class AdminModule {}
