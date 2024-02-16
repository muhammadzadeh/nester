import { BaseCommand } from '../../../../../common/commands/base.command';
import { PaginationOption } from '../../../../../common/database';
import { FindUserOptions, UserOrderBy } from '../../../domain/repositories/users.repository';

export class FindAllProfileQuery extends BaseCommand {
  readonly conditions!: Partial<FindUserOptions>;
  readonly pagination?: PaginationOption<UserOrderBy>;
}
