import { Injectable } from "@nestjs/common";
import { AdminRepository } from "src/admin/repositories/admin.repository";
import { SaveInformationDto } from "../dtos/ei.dto";

@Injectable()
export class EmployeeInformationService {
    constructor(private readonly adminRepo: AdminRepository) {}

    async saveInformation(saveInformationDto: SaveInformationDto, role: string) {

        await this.adminRepo.saveEmployeeInformation(saveInformationDto, "role", true); // probation = true
    }
}