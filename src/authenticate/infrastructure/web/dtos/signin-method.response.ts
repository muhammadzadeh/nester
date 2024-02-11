import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SigninMethod } from '../../../application';

export class SigninMethodResponse {
  @ApiProperty({
    type: SigninMethod,
    enum: SigninMethod,
    isArray: true,
  })
  @Expose()
  @Type(() => String)
  items!: SigninMethod[];
}
