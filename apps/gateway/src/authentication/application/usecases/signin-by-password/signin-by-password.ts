import { BaseCommand, Email, Mobile } from '@package/types';

export class SigninByPasswordCommand extends BaseCommand {
	readonly identifier!: Email | Mobile;
	readonly password!: string;
}
