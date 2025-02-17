import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
	AuthenticationMetaKey,
	CURRENT_USER_KEY,
	CURRENT_WORKSPACE_KEY,
	CurrentUser,
	CurrentWorkspace,
	WORKSPACE_HEADER_KEY,
	WorkspacePermission,
} from '@repo/authentication';
import { CacheService } from '../../../../../common/cache/services';
import { WorkspacesService } from '../../../../application/workspaces.service';
import { WorkspaceUserEntity } from '../../../../domain/entities/workspace-user.entity';
import { WorkspaceUserStatus } from '../../../../domain/enums/workspace-user-status.enum';

@Injectable()
export class CheckWorkspacePermissionGuard implements CanActivate {
	constructor(
		private readonly workspacesService: WorkspacesService,
		private readonly cacheService: CacheService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const controller = context.getClass();
		const route = context.getHandler();
		const request = context.switchToHttp().getRequest();

		const user: CurrentUser = request[CURRENT_USER_KEY];
		if (!user) {
			return true;
		}

		const routeMetadata = this.reflector.getAllAndOverride<{ permissions: WorkspacePermission[] } | undefined>(
			AuthenticationMetaKey.REQUIRED_WORKSPACE_PERMISSION,
			[route, controller],
		);

		if (!routeMetadata) {
			return true;
		}

		const workspaceId = this.extractWorkspaceFromRequest(request);

		let workspace: CurrentWorkspace | undefined = undefined;
		if (workspaceId) {
			const cachedPermissions = await this.readPermissionsFromCache(workspaceId, user.id);

			if (!cachedPermissions) {
				const { items } = await this.workspacesService.findUsers({
					conditions: {
						userIds: [user.id],
						workspaceIds: [workspaceId],
						statuses: [WorkspaceUserStatus.ACCEPTED],
					},
				});

				const workspaceUser: WorkspaceUserEntity | undefined = items.at(0);

				if (workspaceUser?.role?.permissions) {
					workspace = {
						id: workspaceId,
						permissions: workspaceUser.role.permissions as WorkspacePermission[],
					};

					await this.cachePermissions(workspaceId, user.id, workspace.permissions);
					request[CURRENT_WORKSPACE_KEY] = workspace;
				}
			} else {
				workspace = {
					id: workspaceId,
					permissions: cachedPermissions,
				};
				request[CURRENT_WORKSPACE_KEY] = workspace;
			}
		}

		if (!workspace) {
			return false;
		}

		return (
			workspace.permissions?.includes(WorkspacePermission.MANAGE_EVERY_THINGS) ||
			!(
				routeMetadata.permissions?.length > 0 &&
				!routeMetadata.permissions?.some((p: WorkspacePermission) => workspace.permissions?.includes(p))
			)
		);
	}

	private extractWorkspaceFromRequest(request: Request): string | null {
		return request.headers.get(WORKSPACE_HEADER_KEY);
	}

	private async readPermissionsFromCache(workspaceId: string, userId: string): Promise<WorkspacePermission[] | null> {
		const cachedPermissions = await this.cacheService
			.getRedisClient()
			.get(`workspace:${workspaceId}:${userId}:permissions`);

		return cachedPermissions ? (JSON.parse(cachedPermissions) as WorkspacePermission[]) : null;
	}

	private async cachePermissions(
		workspaceId: string,
		userId: string,
		permissions: WorkspacePermission[],
	): Promise<void> {
		await this.cacheService
			.getRedisClient()
			.setex(`workspace:${workspaceId}:${userId}:permissions`, 600, JSON.stringify(permissions));
	}
}
