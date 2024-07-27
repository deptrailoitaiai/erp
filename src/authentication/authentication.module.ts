import { Module } from '@nestjs/common';
import { JsonwebtokenService } from './service/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRETKEY } from './secretKey/secretKey';
import { LoginService } from './service/login.service';
import { AdminModule } from 'src/admin/admin.module';
import { AuthenticationController } from './controller/authentication.controller';

@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global: true,
      secret: SECRETKEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [JsonwebtokenService, LoginService],
  exports: [JsonwebtokenService]
})
export class AuthenticationModule {}
