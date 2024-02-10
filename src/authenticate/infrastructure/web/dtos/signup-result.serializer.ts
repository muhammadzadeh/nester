import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AuthenticationSerializer } from '.';

export class SignupSerializer {
  @ApiProperty({
    type: AuthenticationSerializer,
    description: 'this object only for signup by google initialized',
    nullable: true,
  })
  @Type(() => AuthenticationSerializer)
  token!: AuthenticationSerializer;
}
