import { AuthenticatedCommand } from '@package/types';

export class UpdateMyProfileCommand extends AuthenticatedCommand {
	readonly firstName!: string | null;
	readonly lastName!: string | null;
	readonly avatar!: string | null;
}
