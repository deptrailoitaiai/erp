import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsEntity } from '../entities/permissions.entity';
import { CreatePermissionDto } from '../dtos/permissions.dto';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepo: Repository<PermissionsEntity>,
  ) {}

  async adminModuleCreatePermission(createPermissionDto: CreatePermissionDto) {
    const findPermission = await this.permissionsRepo.findOneBy({
      module: createPermissionDto.module,
      action: createPermissionDto.action,
    });

    if(!findPermission) return 'permission created' 

    const createPermission = await this.permissionsRepo.save(
      this.permissionsRepo.create({
        module: createPermissionDto.module,
        action: createPermissionDto.action,
      }),
    );

    return createPermission
  }
}
