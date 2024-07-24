import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { EmployeeInformationController } from './ei.controller';
import { EmployeeInformationService } from './employee-information.service.ts/ei.service';

@Module({
    imports: [AdminModule],
    controllers: [EmployeeInformationController],
    providers: [EmployeeInformationService]
})
export class EmployeeInformationModule {}
