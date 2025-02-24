import { BaseCommand, Email, Mobile } from '@package/types';

export class SignupByPasswordCommand extends BaseCommand {
	readonly identifier!: Email | Mobile;
	readonly password!: string;
}
