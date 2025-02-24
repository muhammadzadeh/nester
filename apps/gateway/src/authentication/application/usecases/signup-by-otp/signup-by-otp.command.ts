import { BaseCommand, Email, Mobile } from '@package/types';

export class SignupByOtpCommand extends BaseCommand {
	readonly identifier!: Email | Mobile;
}
