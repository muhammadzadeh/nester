import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SigninMethod } from '../../../application';

export class SigninMethodResponse {
  static from(data: SigninMethod[]): SigninMethodResponse {
    return {
      items: data,
    };
  }

  @ApiProperty({
    type: SigninMethod,
    enum: SigninMethod,
    enumName: 'SigninMethod',
    isArray: true,
  })
  @Expose()
  @Type(() => String)
  items!: SigninMethod[];
}
