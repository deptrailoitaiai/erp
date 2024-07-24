import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnnualFormService } from './service/annualForm.service';
import { AnnualFormDto } from 'src/admin/dtos/annualForm.dto';
import { CheckFormDto, SendAnnouncementDto } from './dtos/sendAnnouncement.dto';
import { AdminRepository } from 'src/admin/repositories/admin.repository';
import { formTypeEnum } from 'src/admin/entities/forms.entity';
import { ProbationFormDto } from 'src/admin/dtos/probationForm.dto';
import { ApproveFormOptionDto } from './dtos/approveForm.dto';

@Controller('/forms')
export class FormController {
  constructor(
    private readonly annualFormService: AnnualFormService,
    private readonly adminRepo: AdminRepository,
  ) {}

  @Post('/send')
  async formOpenAnnouncement(@Body() sendAnnouncementDto: SendAnnouncementDto) {
    if (sendAnnouncementDto.specificEmployee && sendAnnouncementDto.specificEmployee.length > 0) {
      this.annualFormService.annualFormAnnouncementSpecificContact(
        sendAnnouncementDto.specificEmployee,
        sendAnnouncementDto.formType,
        sendAnnouncementDto.resubmit,
      );
      return "mail sent";
    }
    const openFormAnnouncement =
      await this.annualFormService.annualFormOpenAnnouncement(
        sendAnnouncementDto.formType,
      );
    return 'mail sent';
  }

  @Post('/checkForm')
  async checkForm(@Body() checkFormDto: CheckFormDto) {
    return (
      await this.adminRepo.getContactUserNotSubmit(checkFormDto.formType)
    ).map((email) => email.email);
  }

  @Post('/annual/:id/submit')
  async formSubmit(
    @Body() formDto: AnnualFormDto,
    @Param('id') id: string
  ) {
    formDto.formType = 'annual' as formTypeEnum
    return await this.adminRepo.submitForm(formDto, id);
  }
  @Post('/probation/:id/submit')
  async probationFormSubmit(
    @Body() formDto: ProbationFormDto,
    @Param('id') id: string,
  ) {
    formDto.formType = "probation" as formTypeEnum;
    return await this.adminRepo.submitForm(formDto, id);
  }

  @Get('/getListForm')
  async listForm() {
    return await this.adminRepo.getForm();
  }

  @Post('/approveForm')
  async approveForm(@Body() approveFormDto: ApproveFormOptionDto) {
    console.log(approveFormDto)
    if (approveFormDto?.reject == true) {
      return this.adminRepo.approveForm(
        approveFormDto.reject,
        approveFormDto.formId,
      );
    }

    return this.adminRepo.approveForm(
      false,
      approveFormDto.formId,
      approveFormDto.approve.superiorOpinion,
      approveFormDto.approve.total,
    );
  }
}
