import { IsNotEmpty } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';

export class IdentifierDto {
  @IsNotEmpty()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;
}
