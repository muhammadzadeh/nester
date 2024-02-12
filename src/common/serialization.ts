import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Type, plainToInstance } from 'class-transformer';
import { snackCaseObject } from './utils';

export class DoneResponse {
  @ApiProperty({
    type: String,
    example: 'OK',
  })
  @Type(() => String)
  message!: string;
}

export class Serializer {
  static serialize<T, K>(output: ClassConstructor<T>, input: K, groups?: string[]): T {
    return snackCaseObject<T>(
      plainToInstance(output, input, {
        exposeDefaultValues: true,
        exposeUnsetFields: true,
        groups,
      }),
    );
  }

  static done() {
    return Serializer.serialize(DoneResponse, { message: 'OK' });
  }
}
