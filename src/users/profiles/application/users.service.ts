import { Inject, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber, isUUID } from 'class-validator';
import { Pagination, PaginationOption } from '../../../common/database';
import { Email, Mobile, UserId, Username } from '../../../common/types';
import { UserEntity, UserNotFoundException } from '../domain/entities/user.entity';
import {
  FindUserOptions,
  USERS_REPOSITORY_TOKEN,
  UserOrderBy,
  UsersRepository,
} from '../domain/repositories/users.repository';
import { CreateUserCommand } from './usecases/create-user/create-user.command';
import { CreateUserUsecase } from './usecases/create-user/create-user.usecase';
import { UpdatePasswordCommand } from './usecases/update-password/update-password.command';
import { UpdatePasswordUsecase } from './usecases/update-password/update-password.usecase';
import { UpdateProfileCommand } from './usecases/update-profile/update-profile.command';
import { UpdateProfileUsecase } from './usecases/update-profile/update-profile.use-case';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository,
    private readonly updatePasswordUsecase: UpdatePasswordUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
  ) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    return this.createUserUsecase.execute(CreateUserCommand.create(data));
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
    await this.updatePasswordUsecase.execute(UpdatePasswordCommand.create({ userId, password }));
  }

  async findAll(
    options: Partial<FindUserOptions>,
    pagination?: PaginationOption<UserOrderBy>,
  ): Promise<Pagination<UserEntity>> {
    return this.usersRepository.findAll(options, pagination);
  }

  async updateProfile(id: UserId, data: Partial<UserEntity>): Promise<void> {
    await this.updateProfileUsecase.execute(
      UpdateProfileCommand.create({
        conditions: {
          ids: [id],
        },
        data,
      }),
    );
  }

  async markUserAsVerified(user: UserEntity): Promise<void> {
    await this.updateProfile(user.id, {
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
    });
  }

  async updateLoggedInTime(user: UserEntity): Promise<void> {
    await this.updateProfile(user.id, {
      lastLoggedInAt: new Date(),
    });
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
