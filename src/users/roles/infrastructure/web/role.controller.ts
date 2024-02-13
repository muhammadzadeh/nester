import { Body, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequiredPermissions } from '../../../../authenticate/infrastructure/web/decorators';
import { AdminController } from '../../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../../common/serialization';
import { ResponseGroup } from '../../../../common/types';
import { RolesService } from '../../application/roles.service';
import { Permission } from '../../domain/entities/role.entity';
import { CreateRoleDto } from './create-role.dto';
import { FilterRoleDto } from './filter-role.dto';
import { GetRoleDto } from './get-role.dto';
import { RoleListResponse } from './role-list.response';
import { UpdateRoleDto } from './update-role.dto';

@ApiTags('Roles')
@AdminController(`/roles`)
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_ROLES)
  async createRole(@Body() data: CreateRoleDto): Promise<DoneResponse> {
    await this.rolesService.createRole(data);
    return Serializer.done();
  }

  @Put(':id')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_ROLES)
  async updateRole(@Param() params: GetRoleDto, @Body() data: UpdateRoleDto): Promise<DoneResponse> {
    await this.rolesService.updateRole(params.id, data);
    return Serializer.done();
  }

  @Get()
  @ApiOkResponse({
    status: 200,
    type: RoleListResponse,
  })
  @RequiredPermissions(Permission.READ_ROLES)
  async getRoles(@Query() filters: FilterRoleDto): Promise<RoleListResponse> {
    const result = await this.rolesService.findAll(
      {},
      {
        page: filters.page,
        pageSize: filters.page_size,
        orderBy: filters.order_by,
        orderDir: filters.order_dir,
      },
    );
    return Serializer.serialize(RoleListResponse, result, [ResponseGroup.ADMIN_LIST]);
  }
}
