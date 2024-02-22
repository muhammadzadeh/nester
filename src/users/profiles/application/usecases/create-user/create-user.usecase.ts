import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { CreateUserCommand } from './create-user.command';

@Injectable()
export class CreateUserUsecase {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const createdUser = new UserEntity(
      command.firstName ?? null,
      command.lastName ?? null,
      command.email ?? null,
      command.mobile ?? null,
    );

    if (command.isEmailVerified) {
      createdUser.markEmailAsVerified();
    }

    if (command.isMobileVerified) {
      createdUser.markMobileAsVerified();
    }

    if (command.password) {
      createdUser.updatePassword(command.password);
    }

    if (command.avatar) {
      //FIXME check if avatar uuid or url
      createdUser.updateAvatar(command.avatar);
    }

    return this.usersRepository.save(createdUser);
  }
}
