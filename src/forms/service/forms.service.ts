import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { FormsRepository } from 'src/admin/repositories/forms.repository';

@Injectable()
export class FormsService {
  constructor(
    private readonly mailService: MailService,
    private readonly formsRepo: FormsRepository,
  ) {}
  async sendEmailAll(formType: string) {
    const emailsAndFormIds =
      await this.formsRepo.formModuleSendAllEmailGetMailAndFormId(formType);
    const emails = emailsAndFormIds.map((data) => data.email);
    const formIds = emailsAndFormIds.map((data) => data.formId);

    const sendEmail = await this.mailService.sendEmail(
      emails,
      formType,
      false,
      formIds,
    );
    return 'sent mail';
  }

  async sendEmailSpecificUser(formType: string, email: string[]) {
    const emailsAndFormIds =
      await this.formsRepo.formModuleSendSpecificEmailGetMailAndFormId(
        formType,
        email,
      );
    const emails = emailsAndFormIds.map((data) => data.email);
    const formIds = emailsAndFormIds.map((data) => data.formId);

    const sendEmail = await this.mailService.sendEmail(
      emails,
      formType,
      false,
      formIds,
    );
    return 'sent mail';
  }

  async sendEmailResubmit(formType: string) {
    const emailsAndFormIds = await this.formsRepo.formModuleSendResubmitEmailGetMailAndFormId();
    const emails = emailsAndFormIds.map((data) => data.email);
    const formIds = emailsAndFormIds.map((data) => data.formId);

    const sendEmail = await this.mailService.sendEmail(
      emails,
      formType,
      true,
      formIds,
    );
    return 'sent mail';
  }
}
