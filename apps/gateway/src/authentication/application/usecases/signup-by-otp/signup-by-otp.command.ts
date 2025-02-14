import { BaseCommand, Email, Mobile } from '@repo/types';

export class SignupByOtpCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
}
