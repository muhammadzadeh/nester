import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from '../application/attachments.service';
import {
  LocalUploader,
  MinioUploader,
  R2Uploader,
  UPLOADER_TOKEN,
  Uploader,
  UploaderHolder,
} from '../application/uploader';
import { ATTACHMENT_USERS_REPOSITORY_TOKEN } from '../domain/repositories/attachment-users.repository';
import { ATTACHMENTS_REPOSITORY_TOKEN } from '../domain/repositories/attachments.repository';
import { TypeormAttachmentEntity, TypeormAttachmentUserEntity } from './database/entities';
import { TypeormAttachmentUsersRepository, TypeormAttachmentsRepository } from './database/repositories';
import { AttachmentsController } from './web';
import { Configuration } from '../../common/config';

const uploaderProvider: Provider = {
  provide: UPLOADER_TOKEN,
  inject: [Configuration],
  useFactory: (config: Configuration): Uploader => {
    let uploader: Uploader | undefined = undefined;
    switch (config.storage.type) {
      case 'local':
        uploader = new LocalUploader(config);
        break;
      case 'minio':
        uploader = new MinioUploader(config);
        break;
      case 'r2':
        uploader = new R2Uploader(config);
        break;
      default:
        uploader = new LocalUploader(config);
    }

    UploaderHolder.set(uploader);

    return uploader;
  },
};

const attachmentUsersRepository: Provider = {
  provide: ATTACHMENT_USERS_REPOSITORY_TOKEN,
  useClass: TypeormAttachmentUsersRepository,
};

const attachmentsRepository: Provider = {
  provide: ATTACHMENTS_REPOSITORY_TOKEN,
  useClass: TypeormAttachmentsRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormAttachmentEntity, TypeormAttachmentUserEntity])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, uploaderProvider, attachmentsRepository, attachmentUsersRepository],
  exports: [AttachmentsService, uploaderProvider],
})
export class AttachmentsModule {}
