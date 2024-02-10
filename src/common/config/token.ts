import { Transform, Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Duration } from 'luxon';

export class TokenConfig {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly jwtSecret!: string;

  @IsOptional()
  @Transform(({ value }) => Duration.fromISO(value ?? 'PT2H'))
  @Type(() => String)
  readonly expiration!: Duration;

  readonly refreshTokenExpiration = Duration.fromISO('P3D');
}
