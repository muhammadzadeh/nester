import { BaseCommand } from "../../../../common/commands/base.command";

export class RefreshTokenCommand extends BaseCommand{
  readonly refreshToken!: string;
  readonly accessToken!: string;
}