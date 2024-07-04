import { AuthenticatedCommand } from '../../../../../common/commands/authenticated.command';

export class UpdatePasswordCommand extends AuthenticatedCommand {
  readonly password!: string;
}
