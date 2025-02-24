import { BaseCommand, Email, Mobile, UserId, Username } from '@package/types';

export class FindOneProfileQuery extends BaseCommand {
	readonly identifier!: Email | Username | Mobile | UserId;
}
