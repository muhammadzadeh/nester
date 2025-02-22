import { AuthenticatedCommand } from '@repo/types';

export class UpdateMyProfileCommand extends AuthenticatedCommand {
	readonly firstName!: string | null;
	readonly lastName!: string | null;
	readonly avatar!: string | null;
}
