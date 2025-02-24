import { BaseCommand, Email, Mobile, UserId, Username } from '@package/types';

export class ImpersonationCommand extends BaseCommand {
	readonly identifier!: Email | Mobile | UserId | Username;
}
