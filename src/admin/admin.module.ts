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
  ],
  exports: [
    FormsRepository,
    UserInformationsRepository,
    UsersRepository,
    UsersFormsRepository,
  ],
})
export class AdminModule {}
