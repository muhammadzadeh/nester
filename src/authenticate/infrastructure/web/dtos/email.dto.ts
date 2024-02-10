import { Type } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';

export class EmailDto {
  @IsDefined()
  @IsEmail()
  @Type(() => String)
  email!: string;
}
