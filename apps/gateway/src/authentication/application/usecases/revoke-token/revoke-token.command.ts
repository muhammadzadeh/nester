import { BaseCommand, UserId } from '@repo/types';
import { RevokeType } from '../../services/jwt-token.service';

export class RevokeTokenCommand extends BaseCommand {
	readonly userId!: UserId;
	readonly revokeType!: RevokeType;
}
