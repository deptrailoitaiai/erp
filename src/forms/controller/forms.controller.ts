import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FormsService } from '../service/forms.service';
import { OpenFormDto } from '../dtos/openForm.dto';
import { FormsRepository } from 'src/admin/repositories/forms.repository';
import { SendEMailDto } from '../dtos/sendEmail.dto';
import { AnnualFormDto } from '../dtos/annualFormSubmit.dto';
import { ProbationFormDto } from '../dtos/probationFormSubmit.dto';
import { CheckFormNotSubmitDto } from '../dtos/checkFormNotsubmit.dto';
import { ApproveFormDto } from '../dtos/approveForm.dto';

@Controller('/forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsRepo: FormsRepository,
  ) {}

  @Post('/openForm')
  async openForm(@Body() openFormDto: OpenFormDto) {
    const openForm = await this.formsRepo.formModuleOpenForm(openFormDto);
    return 'sucessfully opened';
  }

  @Post('/sendEmail')
  async sendEmail(@Body() sendEmailDto: SendEMailDto) {
    if (sendEmailDto.specificEmail.length > 0)
      return await this.formsService.sendEmailSpecificUser(
        sendEmailDto.formType,
        sendEmailDto.specificEmail,
      );

    if (sendEmailDto.resubmit)
      return await this.formsService.sendEmailResubmit(
        sendEmailDto.formType,
      );

    return await this.formsService.sendEmailAll(sendEmailDto.formType);
  }

  @Post('/annual/:formId/submit')
  async submitAnnualForm(
    @Body() annualFormDto: AnnualFormDto,
    @Param('formId') formId: string,
  ) {
    const submitForm = await this.formsRepo.formModuleSubmitAnnualForm(
      annualFormDto,
      formId,
    );
    return 'submitted';
  }

  @Post('/probation/:formId/submit')
  async submitProbationForm(
    @Body() probationFormDto: ProbationFormDto,
    @Param('formId') formId: string,
  ) {
    const submitForm = await this.formsRepo.formModuleSubmitProbationForm(
      probationFormDto,
      formId,
    );
    return 'submitted';
  }

  @Post('/checkFormNotSubmit')
  async checkFormNotSubmit(@Body() checkFormNotSubmitDto: CheckFormNotSubmitDto) {
    const emails = await this.formsRepo.formModuleGetEmailNotSubmitForm(checkFormNotSubmitDto.formType);
    return "list email not submitted"
  }

  @Get('/getListFormSubmitted')
  async getListFormSubmitted() {
    const getListForm = await this.formsRepo.formModuleGetFormSubmited();
    return 'list form'
  }

  @Post('/approveForm')
  async approveForm(@Body() approveFormDto: ApproveFormDto) {
    const approveForm = await this.formsRepo.formModuleApproveForm(approveFormDto);
  }
}
