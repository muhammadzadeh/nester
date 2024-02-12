import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Expose, Type, plainToInstance } from 'class-transformer';
import { snackCaseObject } from './utils';
import { ResponseGroup } from './types';

export class DoneResponse {
  @ApiProperty({
    type: String,
    example: 'OK',
  })
  @Expose()
  @Type(() => String)
  message!: string;
}

export class Serializer {
  static serialize<T, K>(output: ClassConstructor<T>, input: K, groups?: ResponseGroup[]): T {
    return snackCaseObject<T>(
      plainToInstance(output, input, {
        exposeDefaultValues: true,
        exposeUnsetFields: true,
        strategy: 'excludeAll',
        groups,
      }),
    );
  }

  static done() {
    return Serializer.serialize(DoneResponse, { message: 'OK' });
  }
}
