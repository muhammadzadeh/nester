import { BaseCommand, UserId } from '@package/types';
import { RevokeType } from '../../services/jwt-token.service';

export class RevokeTokenCommand extends BaseCommand {
	readonly userId!: UserId;
	readonly revokeType!: RevokeType;
}
