import { applyDecorators, createParamDecorator, ExecutionContext, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Email, Mobile, Permission, UserId, WorkspacePermission } from '@repo/types';
import { Captcha } from '../../../common/captcha/infrastructure/web/decorators';
import { CheckSignupGuard } from './guards/check-signup.guard';

export enum AuthenticationMetaKey {
	IGNORE_AUTHORIZATION_GUARD = 'ignore_authorization_guard',
	ALLOW_UN_AUTHORIZED_REQUESTS = 'allow_unauthorized_requests',
	REQUIRED_PERMISSION = 'required_permissions',
	REQUIRED_WORKSPACE_PERMISSION = 'required_workspace_permissions',
	IGNORE_CHECK_IS_ENABLE_GUARD = 'ignore_check_is_enable_guard',
	REGISTER_USER = 'register_user',
}

export const IgnoreAuthorizationGuard = (): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.IGNORE_AUTHORIZATION_GUARD, true);

export const AllowUnauthorizedGuard = (): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.ALLOW_UN_AUTHORIZED_REQUESTS, true);

export const RequiredPermissions = (...permissions: Permission[]): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.REQUIRED_PERMISSION, { permissions });

export const RequiredWorkspacePermissions = (...permissions: WorkspacePermission[]): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.REQUIRED_WORKSPACE_PERMISSION, { permissions });

export const AnonymousUser = (): MethodDecorator =>
	applyDecorators(SetMetadata(AuthenticationMetaKey.REGISTER_USER, true), IgnoreAuthorizationGuard());

export const IgnoreIsEnableGuard = (): MethodDecorator =>
	applyDecorators(SetMetadata(AuthenticationMetaKey.IGNORE_CHECK_IS_ENABLE_GUARD, true));

export const Signup = (path: string): MethodDecorator =>
	applyDecorators(Post(path), Captcha(), UseGuards(CheckSignupGuard));

export const CurrentUser = createParamDecorator(
	(_data: unknown, context: ExecutionContext): CurrentUser | undefined => {
		const user: CurrentUser = context.switchToHttp().getRequest()[CURRENT_USER_KEY];
		if (!user) {
			return undefined;
		}

		return user;
	},
);

export const CurrentWorkspace = createParamDecorator(
	(_data: unknown, context: ExecutionContext): CurrentWorkspace | undefined => {
		const workspace: CurrentWorkspace = context.switchToHttp().getRequest()[CURRENT_WORKSPACE_KEY];
		if (!workspace) {
			return undefined;
		}

		return workspace;
	},
);

export const CURRENT_USER_KEY = 'user';
export const CURRENT_WORKSPACE_KEY = 'workspace';

export type CurrentUser = {
	id: UserId;
	email: Email | null;
	mobile: Mobile | null;
	isEmailVerified: boolean;
	isMobileVerified: boolean;
	permissions?: Permission[];
	isBlocked: boolean;
};

export type CurrentWorkspace = {
	id: string;
	permissions: WorkspacePermission[];
};
