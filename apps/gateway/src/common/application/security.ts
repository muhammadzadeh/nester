import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { IsUserEnableGuard } from '@package/authentication';
import { CaptchaGuard } from '@package/captcha';
import { Configuration } from '@package/config';
import { AuthorizationGuard, CheckPermissionGuard } from '../../authentication/presenter/http/guards';
import { CheckWorkspacePermissionGuard } from '../../workspaces/presenter/http/user/guards/check-workspace-permission.guard';
import { ThrottlerBehindProxyGuard } from '../guards/throttler-behind-proxy.guard';

export function configureSecurity(app: NestFastifyApplication): void {
	const configService = app.get(Configuration);
	const isSwaggerEnabled = configService.swagger?.enabled;

	app.useGlobalGuards(app.get(ThrottlerBehindProxyGuard));
	app.useGlobalGuards(app.get(AuthorizationGuard));
	app.useGlobalGuards(app.get(CaptchaGuard));
	app.useGlobalGuards(app.get(CheckPermissionGuard));
	app.useGlobalGuards(app.get(CheckWorkspacePermissionGuard));
	app.useGlobalGuards(app.get(IsUserEnableGuard));
	app.register(
		helmet,
		isSwaggerEnabled
			? {
					contentSecurityPolicy: {
						directives: {
							defaultSrc: [`'self'`],
							styleSrc: [`'self'`, `'unsafe-inline'`],
							imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
							scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
						},
					},
				}
			: {},
	);
}
