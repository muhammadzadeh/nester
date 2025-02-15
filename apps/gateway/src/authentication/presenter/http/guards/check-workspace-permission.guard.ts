import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WorkspacePermission } from '@repo/types';
import { AuthenticationMetaKey, CURRENT_WORKSPACE_KEY, CurrentWorkspace } from '../decorators';

@Injectable()
export class CheckWorkspacePermissionGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const controller = context.getClass();
		const route = context.getHandler();
		const workspace: CurrentWorkspace = context.switchToHttp().getRequest()[CURRENT_WORKSPACE_KEY];
		if (!workspace) {
			return true;
		}

		const routeMetadata = this.reflector.getAllAndOverride<{ permissions: WorkspacePermission[] } | undefined>(
			AuthenticationMetaKey.REQUIRED_WORKSPACE_PERMISSION,
			[route, controller],
		);

		if (!routeMetadata) {
			return true;
		}

		return (
			workspace.permissions?.includes(WorkspacePermission.MANAGE_EVERY_THINGS) ||
			!(
				routeMetadata.permissions?.length > 0 &&
				!routeMetadata.permissions?.some((p: WorkspacePermission) => workspace.permissions?.includes(p))
			)
		);
	}
}
