import { BaseCommand, Email, Mobile } from '@package/types';

export class RequestResetPasswordCommand extends BaseCommand {
	readonly identifier!: Email | Mobile;
}
