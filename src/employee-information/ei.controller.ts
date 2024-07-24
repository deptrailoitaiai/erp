import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EmployeeInformationService } from "./employee-information.service.ts/ei.service";
import { AdminRepository } from "src/admin/repositories/admin.repository";
import { SaveInformationDto } from "./dtos/ei.dto";

@Controller('employee-information')
export class EmployeeInformationController {
    constructor(
        private readonly eiService: EmployeeInformationService,
        private readonly adminRepo: AdminRepository
    ) {}

    @Post('/:email/save')
    async saveInformation(@Body() saveInformationDto: SaveInformationDto, @Param('email') email: string) {
        saveInformationDto.email = email;
        const role = '....'
        await this.eiService.saveInformation(saveInformationDto, role);
    }

    @Get('/readInformation')
    async readInformation() {
        return await this.adminRepo.readInformation();
    }

    @Get('/:email/readOwnInformation')
    async readOwnInformation(@Param('email') email: string) {
        return await this.adminRepo.readOwnInformation(email);
    }
}