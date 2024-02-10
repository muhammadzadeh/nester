import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokenData } from '../../../application';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token!: string;

  @IsNotEmpty()
  @IsString()
  access_token!: string;

  toRefreshTokenData(): RefreshTokenData {
    return new RefreshTokenData(this.access_token, this.refresh_token);
  }
}
