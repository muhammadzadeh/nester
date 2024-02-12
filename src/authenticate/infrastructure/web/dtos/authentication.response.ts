import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AuthenticationResponse {
  @ApiProperty({
    type: String,
    name: 'access_token',
    description: 'The access token',
  })
  @Type(() => String)
  accessToken!: string;

  @ApiProperty({
    type: String,
    name: 'refresh_token',
    description: 'The refresh token, using for generate new access token',
  })
  @Type(() => String)
  refreshToken!: string;

  @ApiProperty({
    type: Date,
    name: 'expire_at',
    description: 'The access token expiration date',
  })
  @Type(() => Date)
  expireAt!: Date;
}
