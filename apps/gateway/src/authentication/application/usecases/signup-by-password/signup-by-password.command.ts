import { BaseCommand, Email, Mobile } from '@repo/types';

export class SignupByPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly password!: string;
}
