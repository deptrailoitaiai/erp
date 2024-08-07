import { Module } from '@nestjs/common';
import { FormsController } from './controller/forms.controller';
import { FormsService } from './service/forms.service';
import { AdminModule } from 'src/admin/admin.module';
import { MailService } from './service/mail.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
    imports: [AdminModule, AuthenticationModule],
    controllers: [FormsController],
    providers: [FormsService, MailService]
})
export class FormsModule {}
