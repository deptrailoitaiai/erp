import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FormsService } from '../service/forms.service';
import { OpenFormDto } from '../dtos/openForm.dto';
import { FormsRepository } from 'src/admin/repositories/forms.repository';
import { SendEMailDto } from '../dtos/sendEmail.dto';
import { AnnualFormDto } from '../dtos/annualFormSubmit.dto';
import { ProbationFormDto } from '../dtos/probationFormSubmit.dto';
import { CheckFormNotSubmitDto } from '../dtos/checkFormNotsubmit.dto';
import { ApproveFormDto } from '../dtos/approveForm.dto';
import { JsonwebtokenService } from 'src/authentication/service/jwt.service';
import { Request } from 'express';

@Controller('/forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsRepo: FormsRepository,
    private readonly jsonwebtokenService: JsonwebtokenService,
  ) {}

  @Post('/openForm')
  async openForm(@Body() openFormDto: OpenFormDto, @Req() req: Request) {
    const guard = await this.jsonwebtokenService.checkRoleByAccessToken(
      req.cookies['access_token'],
      ['Hr', 'Director', 'Admin'],
    );
    if (!guard) return new UnauthorizedException();

    const userId = guard as string;

    const openForm = await this.formsRepo.formModuleOpenForm(
      openFormDto,
      userId,
    );
    return 'sucessfully opened';
  }

  @Post('/sendEmail')
  async sendEmail(@Body() sendEmailDto: SendEMailDto, @Req() req: Request) {
    const guard = await this.jsonwebtokenService.checkRoleByAccessToken(
      req.cookies['access_token'],
      ['Hr', 'Director', 'Admin'],
    );
    if (!guard) return new UnauthorizedException();

    if (sendEmailDto.specificEmail.length > 0)
      return await this.formsService.sendEmailSpecificUser(
        sendEmailDto.formType,
        sendEmailDto.specificEmail,
      );

    if (sendEmailDto.resubmit)
      return await this.formsService.sendEmailResubmit(sendEmailDto.formType);

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
  async checkFormNotSubmit(
    @Body() checkFormNotSubmitDto: CheckFormNotSubmitDto,
    @Req() req: Request,
  ) {
    const guard = await this.jsonwebtokenService.checkRoleByAccessToken(
      req.cookies['access_token'],
      ['Hr', 'Director', 'Admin'],
    );
    if (!guard) return new UnauthorizedException();

    const emails = await this.formsRepo.formModuleGetEmailNotSubmitForm(
      checkFormNotSubmitDto.formType,
    );
    return 'list email not submitted';
  }

  @Get('/getListFormSubmitted')
  async getListFormSubmitted(@Req() req: Request) {
    const guard = await this.jsonwebtokenService.checkRoleByAccessToken(
      req.cookies['access_token'],
      ['Hr', 'Director', 'Admin'],
    );
    if (!guard) return new UnauthorizedException();

    const getListForm = await this.formsRepo.formModuleGetFormSubmited();
    return 'list form';
  }

  @Post('/approveForm')
  async approveForm(@Body() approveFormDto: ApproveFormDto, @Req() req: Request) {
    const guard = await this.jsonwebtokenService.checkRoleByAccessToken(
      req.cookies['access_token'],
      ['Hr', 'Director', 'Admin'],
    );
    if (!guard) return new UnauthorizedException();

    const approveForm =
      await this.formsRepo.formModuleApproveForm(approveFormDto);
  }
}
