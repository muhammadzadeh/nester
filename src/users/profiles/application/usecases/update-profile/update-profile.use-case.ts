import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { UpdateProfileCommand } from './update-profile.command';

@Injectable()
export class UpdateProfileUsecase {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    await this.usersRepository.update(command.conditions, command.data);
  }
}
