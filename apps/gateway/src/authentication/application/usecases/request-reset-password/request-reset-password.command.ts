import { BaseCommand, Email, Mobile } from '@repo/types';

export class RequestResetPasswordCommand extends BaseCommand {
	readonly identifier!: Email | Mobile;
}
