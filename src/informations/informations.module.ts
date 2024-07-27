import { Module } from '@nestjs/common';
import { InformationController } from './controller/information.controller';
import { InformationService } from './service/information.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
    imports: [AdminModule],
    controllers: [InformationController],
    providers: [InformationService]
})
export class InformationsModule {}
