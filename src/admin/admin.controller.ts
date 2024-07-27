import { Controller } from "@nestjs/common";
import { AdminService } from "./services/admin.service";

@Controller()
export class AdminController {
    constructor(public readonly adminService: AdminService) {}
}