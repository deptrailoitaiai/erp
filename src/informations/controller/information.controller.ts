import { Body, Controller, Param, Post } from '@nestjs/common';
import { InformationService } from '../service/information.service';
import { SaveInformationDto } from '../dtos/saveInformation.dto';
import { UserInformationsRepository } from 'src/admin/repositories/userInfomations.repository';

@Controller('/information')
export class InformationController {
  constructor(
    private readonly informationService: InformationService,
    private readonly userInformationRepo: UserInformationsRepository
) {}

  @Post('/:userId/save')
  async saveInformation(
    @Body() saveInformationDto: SaveInformationDto,
    @Param('userId') userId: string,
  ) {
    const saveInfor = await this.userInformationRepo.informationModuleSave(userId, saveInformationDto)

    return "saved"
  }

  @Post('/:userId/getInformation')
  async getInformation(@Param('userId') userId: string) {
    const getInfor = await this.userInformationRepo.infomationModuleRead(userId);

    return 'data'
  }
}
