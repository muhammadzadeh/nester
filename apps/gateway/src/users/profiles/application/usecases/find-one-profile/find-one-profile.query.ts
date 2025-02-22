import { BaseCommand, Email, Mobile, UserId, Username } from '@repo/types';

export class FindOneProfileQuery extends BaseCommand {
	readonly identifier!: Email | Username | Mobile | UserId;
}
