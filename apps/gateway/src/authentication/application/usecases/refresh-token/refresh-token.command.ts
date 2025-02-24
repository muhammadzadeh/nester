import { BaseCommand } from '@package/types';

export class RefreshTokenCommand extends BaseCommand {
	readonly refreshToken!: string;
	readonly accessToken!: string;
}
