import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SigninMethod } from '../../../application';

export class SigninMethodResponse {
  @ApiProperty({
    type: SigninMethod,
    enum: SigninMethod,
    isArray: true,
  })
  @Type(() => String)
  items!: SigninMethod[];
}
