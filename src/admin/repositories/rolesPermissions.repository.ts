import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesPermissionsEntity } from "../entities/rolesPermissions.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesPermissionsRepository {
    constructor(
        @InjectRepository(RolesPermissionsEntity)
        private readonly rolesPermissionsRepo: Repository<RolesPermissionsEntity>,
    ) {}
}