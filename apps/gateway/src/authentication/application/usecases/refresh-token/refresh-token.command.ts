import { BaseCommand } from "@repo/types";

export class RefreshTokenCommand extends BaseCommand{
  readonly refreshToken!: string;
  readonly accessToken!: string;
}