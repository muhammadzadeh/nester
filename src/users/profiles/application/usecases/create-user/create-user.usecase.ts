import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { isUUID } from 'validator';
import { AttachmentsService } from '../../../../../attachments/application/attachments.service';
import { AttachmentEntity, AttachmentVisibility } from '../../../../../attachments/domain/entities/attachments.entity';
import { UserId } from '../../../../../common/types';
import { InvalidAvatarException, UserEntity } from '../../../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../../../domain/repositories/users.repository';
import { CreateUserCommand } from './create-user.command';

@Injectable()
export class CreateUserUsecase {
  private readonly logger = new Logger(CreateUserUsecase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository,
    private readonly attachmentService: AttachmentsService,
    private readonly httpService: HttpService,
  ) {}

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
      if (isUUID(command.avatar, '4')) {
        const avatarRecord = await this.attachmentService.findOneOrFail(command.avatar);
        if (avatarRecord.isPrivate()) {
          throw new InvalidAvatarException(`Only public attachment allowed for avatar!`);
        }

        createdUser.updateAvatar(avatarRecord.getStoredPath(), avatarRecord.id);
      } else {
        const avatarRecord = await this.moveUserAvatarToCdn(createdUser.id, command.avatar);
        if (avatarRecord) {
          createdUser.updateAvatar(avatarRecord.getStoredPath(), avatarRecord.id);
        }
      }
    }

    return this.usersRepository.save(createdUser);
  }

  private async moveUserAvatarToCdn(userId: UserId, avatarUrl: string): Promise<AttachmentEntity | undefined> {
    try {
      const avatarData = await this.httpService.axiosRef.get(avatarUrl, {
        responseType: 'arraybuffer',
      });

      const items = await this.attachmentService.upload([
        {
          data: Buffer.from(avatarData.data, 'binary'),
          filename: 'avatar',
          uploaderId: userId,
          visibility: AttachmentVisibility.PUBLIC,
        },
      ]);

      return items[0];
    } catch (error) {
      this.logger.error(`Could not move users avatar to out cdn!`);
      this.logger.error(error);
      return undefined;
    }
  }
}
