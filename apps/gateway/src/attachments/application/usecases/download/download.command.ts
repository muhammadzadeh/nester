import { OptionalAuthenticatedCommand } from '@repo/types';

export class DownloadCommand extends OptionalAuthenticatedCommand {
  readonly id!: string;
  readonly isShared?: boolean;
}
