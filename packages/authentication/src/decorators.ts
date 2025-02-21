import { applyDecorators, createParamDecorator, ExecutionContext, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { Captcha } from '@repo/captcha';
import { AuthenticationMetaKey } from './authentication-meta-ket.enum';
import { CheckSignupGuard } from './check-signup.guard';
import { CURRENT_USER_KEY, CURRENT_WORKSPACE_KEY } from './constants';
import { CurrentUser } from './current-user';
import { CurrentWorkspace } from './current-workspace';
import { SystemPermission, WorkspacePermission } from './permission.enum';

export const IgnoreAuthorizationGuard = (): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.IGNORE_AUTHORIZATION_GUARD, true);

export const AllowUnauthorizedGuard = (): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.ALLOW_UN_AUTHORIZED_REQUESTS, true);

export const RequiredSystemPermissions = (...permissions: SystemPermission[]): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.REQUIRED_PERMISSION, { permissions });

export const RequiredWorkspacePermissions = (...permissions: WorkspacePermission[]): MethodDecorator & ClassDecorator =>
	SetMetadata(AuthenticationMetaKey.REQUIRED_WORKSPACE_PERMISSION, { permissions });

export const AnonymousUser = (): MethodDecorator =>
	applyDecorators(SetMetadata(AuthenticationMetaKey.REGISTER_USER, true), IgnoreAuthorizationGuard());

export const IgnoreIsEnableGuard = (): MethodDecorator =>
	applyDecorators(SetMetadata(AuthenticationMetaKey.IGNORE_CHECK_IS_ENABLE_GUARD, true));

export const Signup = (path: string): MethodDecorator =>
	applyDecorators(Post(path), Captcha(), UseGuards(CheckSignupGuard));

export const User = createParamDecorator((_data: unknown, context: ExecutionContext): CurrentUser | undefined => {
	const user: CurrentUser = context.switchToHttp().getRequest()[CURRENT_USER_KEY];
	if (!user) {
		return undefined;
	}

	return user;
});

export const Workspace = createParamDecorator(
	(_data: unknown, context: ExecutionContext): CurrentWorkspace | undefined => {
		const workspace: CurrentWorkspace = context.switchToHttp().getRequest()[CURRENT_WORKSPACE_KEY];
		if (!workspace) {
			return undefined;
		}

		return workspace;
	},
);
