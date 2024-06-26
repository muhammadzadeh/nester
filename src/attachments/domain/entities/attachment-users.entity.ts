import { UserId } from '../../../common/types';

export class AttachmentUserEntity {
  constructor(
    readonly attachmentId: string,
    readonly userId: UserId,
  ) {}
}

export type AttachmentId = string;
