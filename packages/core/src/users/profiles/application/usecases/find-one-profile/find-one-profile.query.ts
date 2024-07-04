import { BaseCommand } from '../../../../../common/commands/base.command';
import { Email, Mobile, UserId, Username } from '../../../../../common/types';

export class FindOneProfileQuery extends BaseCommand {
  readonly identifier!: Email | Username | Mobile | UserId;
}
