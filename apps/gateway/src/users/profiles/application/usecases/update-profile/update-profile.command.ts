import { BaseCommand } from '@repo/types';
import { UserEntity } from '../../../domain/entities/user.entity';
import { FindUserOptions } from '../../../domain/repositories/users.repository';

export class UpdateProfileCommand extends BaseCommand {
	readonly conditions!: Partial<FindUserOptions>;
	readonly data!: Partial<UserEntity>;
}
