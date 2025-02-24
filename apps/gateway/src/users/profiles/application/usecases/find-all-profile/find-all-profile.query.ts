import { BaseCommand, PaginationOption } from '@package/types';
import { FindUserOptions, UserOrderBy } from '../../../domain/repositories/users.repository';

export class FindAllProfileQuery extends BaseCommand {
	readonly conditions!: Partial<FindUserOptions>;
	readonly pagination?: PaginationOption<UserOrderBy>;
}
