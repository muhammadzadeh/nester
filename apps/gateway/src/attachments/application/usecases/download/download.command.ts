import { OptionalAuthenticatedCommand } from '@package/types';

export class DownloadCommand extends OptionalAuthenticatedCommand {
	readonly id!: string;
	readonly isShared?: boolean;
}
