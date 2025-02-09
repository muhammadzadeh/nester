import { BaseCommand, Email, Mobile } from '@repo/types';

export class SigninByPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly password!: string;
}
