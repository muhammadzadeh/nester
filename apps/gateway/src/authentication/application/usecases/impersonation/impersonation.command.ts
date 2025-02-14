import { BaseCommand, Email, Mobile, UserId, Username } from '@repo/types';

export class ImpersonationCommand extends BaseCommand {
  readonly identifier!: Email | Mobile | UserId | Username;
}
