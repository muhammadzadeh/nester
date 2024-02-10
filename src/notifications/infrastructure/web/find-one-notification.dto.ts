import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneNotificationDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID('all')
  id!: string;
}
