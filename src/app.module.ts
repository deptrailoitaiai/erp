import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MySqlConfig } from './config/mysql.config';
import { FormModule } from './form/form.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeInformationModule } from './employee-information/employee-information.module';
import { AuthenticationModule } from './authentication/authentication.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MySqlConfig,
    AdminModule, FormModule, EmployeeInformationModule, AuthenticationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
