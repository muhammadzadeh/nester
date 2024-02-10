import { Inject, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber, isUUID } from 'class-validator';
import { Pagination, PaginationOption } from '../../common/database';
import { Email, Mobile, UserId, Username } from '../../common/types';
import { UserEntity, UserNotFoundException } from '../domain/entities/user.entity';
import {
  FindUserOptions,
  USERS_REPOSITORY_TOKEN,
  UserOrderBy,
  UsersRepository,
} from '../domain/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const createdUser = new UserEntity(
      data.firstName ?? null,
      data.lastName ?? null,
      data.email ?? null,
      data.mobile ?? null,
      data.avatar ?? null,
    );

    if (data.isEmailVerified) {
      createdUser.markEmailAsVerified();
    }

    if (data.isMobileVerified) {
      createdUser.markMobileAsVerified();
    }

    if (data.password) {
      createdUser.updatePassword(data.password);
    }

    return this.usersRepository.save(createdUser);
  }

  async findOneByIdentifierOrFail(id: Email | Username | Mobile | UserId): Promise<UserEntity> {
    const user = await this.findOneByIdentifier(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneByIdentifier(id: Email | Username | Mobile | UserId): Promise<UserEntity | null> {
    const options: Partial<FindUserOptions> = {};
    if (isEmail(id)) {
      options.emails = [id];
    } else if (isUUID(id)) {
      options.ids = [id];
    } else if (isPhoneNumber(id)) {
      options.mobiles = [id];
    } else {
      options.usernames = [id];
    }

    return this.usersRepository.findOne(options);
  }

  async updatePassword(userId: UserId, password: string): Promise<void> {
    const user = await this.findOneByIdentifierOrFail(userId);
    user.updatePassword(password);
    await this.usersRepository.save(user);
  }

  async findAll(
    options: Partial<FindUserOptions>,
    pagination?: PaginationOption<UserOrderBy>,
  ): Promise<Pagination<UserEntity>> {
    return this.usersRepository.findAll(options, pagination);
  }

  async markUserAsVerified(user: UserEntity): Promise<void> {
    await this.usersRepository.update(
      {
        ids: [user.id],
      },
      {
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
      },
    );
  }

  async updateLoggedInTime(user: UserEntity): Promise<void> {
    await this.usersRepository.update(
      {
        ids: [user.id],
      },
      {
        lastLoggedInAt: new Date(),
      },
    );
  }
}

export class CreateUserData {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: Email | null;
  readonly mobile?: Mobile | null;
  readonly avatar?: string | null;
  readonly password?: string | null;
  readonly isEmailVerified?: boolean;
  readonly isMobileVerified?: boolean;
}
