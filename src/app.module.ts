import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { MySqlConfig } from './config/mysql.config';
import { ConfigModule } from '@nestjs/config';
import { FormsModule } from './forms/forms.module';
import { InformationsModule } from './informations/informations.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    MySqlConfig,
    AdminModule,
    FormsModule,
    InformationsModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
