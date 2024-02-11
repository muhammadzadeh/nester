import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AuthenticationResponse } from '.';

export class SignupResponse {
  @ApiProperty({
    type: AuthenticationResponse,
    description: 'this object only for signup by google initialized',
    nullable: true,
  })
  @Type(() => AuthenticationResponse)
  token!: AuthenticationResponse;
}
