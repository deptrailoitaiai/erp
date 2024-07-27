import { Module } from '@nestjs/common';
import { JsonwebtokenService } from './service/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRETKEY } from './secretKey/secretKey';
import { LoginService } from './service/login.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global: true,
      secret: SECRETKEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JsonwebtokenService, LoginService],
})
export class AuthenticationModule {}
