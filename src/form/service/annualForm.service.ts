import { Injectable } from "@nestjs/common";
import { AdminRepository } from "src/admin/repositories/admin.repository";
import { MailService } from "./mail.service";

@Injectable()
export class AnnualFormService {
    constructor(
        private readonly adminRepo: AdminRepository,
        private readonly mailService: MailService,
    ) {}
    async annualFormOpenAnnouncement(formType: string) {
        const contacts: informationsType[] = await this.adminRepo.getContactUserNotSubmit(formType);
        const sendMail = await this.mailService.annualReportFormAnnouncement(contacts, formType);
    }

    async annualFormAnnouncementSpecificContact(emails: string[], formType: string, status: boolean) {
        console.log("hehee" + status)
        const contacts = await this.adminRepo.getSpecificContact(emails);
        const sendMail = await this.mailService.annualReportFormAnnouncement(contacts, formType, status);
    }
}

export interface informationsType {
    email: string;
    id: string;
}
