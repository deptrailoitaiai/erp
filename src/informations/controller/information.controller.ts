import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InformationService } from '../service/information.service';
import { SaveInformationDto } from '../dtos/saveInformation.dto';
import { UserInformationsRepository } from 'src/admin/repositories/userInfomations.repository';
import { Request } from 'express';
import { JsonwebtokenService } from 'src/authentication/service/jwt.service';

@Controller('/information')
export class InformationController {
  constructor(
    private readonly informationService: InformationService,
    private readonly userInformationRepo: UserInformationsRepository,
    private readonly jsonwebtokenService: JsonwebtokenService,
  ) {}

  @Post('/save')
  async saveInformation(
    @Body() saveInformationDto: SaveInformationDto,
    @Req() req: Request,
  ) {
    const guard = await this.jsonwebtokenService.checkAccessTokenAndGetId(
      req.cookies['access_token'],
    );
    if (!guard) return new UnauthorizedException();

    const userId = guard as string;

    const saveInfor = await this.userInformationRepo.informationModuleSave(
      userId,
      saveInformationDto,
    );

    return 'saved';
  }

  @Get('/getInformation')
  async getInformation(@Req() req: Request) {
    const guard = await this.jsonwebtokenService.checkAccessTokenAndGetId(req.cookies['access_token']);
    if(!guard) return new UnauthorizedException()
    
    const userId = guard as string;

    const getInfor =
      await this.userInformationRepo.infomationModuleRead(userId);

    return 'data';
  }
}
