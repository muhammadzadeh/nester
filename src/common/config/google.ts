import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleConfig {
  @IsNotEmpty()
  @IsString()
  readonly clientId!: string;

  @IsNotEmpty()
  @IsString()
  readonly clientSecret!: string;
}
