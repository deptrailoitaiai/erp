import { TypeOrmModule } from "@nestjs/typeorm";
import { FormsEntity } from "src/admin/entities/forms.entity";
import { PermissionsEntity } from "src/admin/entities/permissions.entity";
import { RolesEntity } from "src/admin/entities/roles.entity";
import { RolesPermissionsEntity } from "src/admin/entities/rolesPermissions.entity";
import { RolesUsersEntity } from "src/admin/entities/rolesUsers.entity";
import { UserInformationsEntity } from "src/admin/entities/userInformations.entity";
import { UsersEntity } from "src/admin/entities/users.entity";
import { UsersFormsEntity } from "src/admin/entities/usersForms.entity";


export const MySqlConfig = TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'minhthongminh123',
    database: 'erp',
    entities: [UsersEntity, UsersFormsEntity, RolesEntity, RolesUsersEntity, RolesPermissionsEntity,
        PermissionsEntity, UserInformationsEntity, FormsEntity
    ],
    synchronize: true
})