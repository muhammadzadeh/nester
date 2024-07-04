import { BaseCommand } from '../../../../common/commands/base.command';
import { UserId } from '../../../../common/types';
import { RevokeType } from '../../services/jwt-token.service';

export class RevokeTokenCommand extends BaseCommand {
  readonly userId!: UserId;
  readonly revokeType!: RevokeType;
}
