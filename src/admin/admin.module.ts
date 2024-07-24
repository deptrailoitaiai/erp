import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { UsersEntity } from './entities/users.entity';
import { RolesUsersEntity } from './entities/rolesUsers.entity';
import { RolesEntity } from './entities/roles.entity';
import { RolesPermissionsEntity } from './entities/rolesPermissions.entity';
import { PermissionsEntity } from './entities/permissions.entity';
import { FormsEntity } from './entities/forms.entity';
import { EmployeeInformationsEntity } from './entities/employeeInformations.entity';
import { UsersEmployeeInformationsEntity } from './entities/usersEmployeeInformations.entity';
import { UsersFormsEntity } from './entities/usersForms.entity';
import { AdminRepository } from './repositories/admin.repository';
import { UserRolePermissionRepository } from './repositories/userRolePermission.repository';
import { AfterSaveRepository } from './repositories/afterSave.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      RolesUsersEntity,
      RolesEntity,
      RolesPermissionsEntity,
      PermissionsEntity,
      FormsEntity,
      EmployeeInformationsEntity,
      UsersEmployeeInformationsEntity,
      UsersFormsEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    UserRolePermissionRepository,
    AfterSaveRepository,
  ],
  exports: [AdminRepository],
})
export class AdminModule {}
