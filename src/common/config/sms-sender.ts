import { IsDefined, IsIn, IsString } from 'class-validator';

export class SmsSenderConfig<T = 'local'> {
  readonly logger = true;

  @IsDefined()
  @IsString()
  @IsIn(['local'])
  readonly provider!: T;
}
