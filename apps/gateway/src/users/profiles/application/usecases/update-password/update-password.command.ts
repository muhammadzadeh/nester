import { AuthenticatedCommand } from '@package/types';

export class UpdatePasswordCommand extends AuthenticatedCommand {
	readonly password!: string;
}
