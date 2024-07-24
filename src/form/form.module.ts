import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { AnnualFormService } from './service/annualForm.service';
import { MailService } from './service/mail.service';
import { AdminModule } from 'src/admin/admin.module';
import { AdminRepository } from 'src/admin/repositories/admin.repository';

@Module({
    imports: [
        AdminModule
    ],
    controllers: [FormController],
    providers: [AnnualFormService, MailService]
})
export class FormModule {}
