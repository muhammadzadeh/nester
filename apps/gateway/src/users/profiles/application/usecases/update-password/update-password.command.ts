import { AuthenticatedCommand } from '@repo/types';

export class UpdatePasswordCommand extends AuthenticatedCommand {
  readonly password!: string;
}
