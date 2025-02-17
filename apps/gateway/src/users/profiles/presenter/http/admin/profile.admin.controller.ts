import { Body, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequiredPermissions, SystemPermission } from '@repo/authentication';
import { AdminController } from '@repo/decorator';
import { DoneResponse } from '@repo/types';
import { UsersService } from '../../../application/users.service';
import { FilterUserDto } from '../common/filter-user.dto';
import { GetUserDto } from '../common/get-user.dto';
import { UserListResponse } from '../common/user-list.response';
import { UserResponse } from '../common/user.response';
import { UpdateUserRoleDto } from './update-user-role.dto';

@ApiTags('Users')
@AdminController(`/users`)
export class ProfileControllerForAdmin {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@ApiOkResponse({
		status: 200,
		type: UserListResponse,
	})
	@RequiredPermissions(SystemPermission.READ_USERS)
	async getAllUsers(@Query() filters: FilterUserDto): Promise<UserListResponse> {
		const result = await this.usersService.findAll({}, filters);
		return UserListResponse.from(result, filters);
	}

	@Get(':id')
	@ApiOkResponse({
		status: 200,
		type: UserResponse,
	})
	@RequiredPermissions(SystemPermission.READ_USERS)
	async getUserById(@Param() params: GetUserDto): Promise<UserResponse> {
		const userProfile = await this.usersService.findOneByIdentifierOrFail(params.id);
		return UserResponse.from(userProfile);
	}

	@Patch(':id/role')
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	@RequiredPermissions(SystemPermission.WRITE_USERS)
	async updateMyProfile(@Param() params: GetUserDto, @Body() data: UpdateUserRoleDto): Promise<DoneResponse> {
		await this.usersService.updateProfile(params.id, data.toEntity());
		return new DoneResponse();
	}
}
