import { OptionalAuthenticatedCommand } from '../../../../../common/commands/optional-authenticated.command';

export class DownloadCommand extends OptionalAuthenticatedCommand {
  readonly attachmentId!: string;
}
