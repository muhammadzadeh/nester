import { UserId } from '@repo/types';

export class AttachmentUserEntity {
  constructor(
    readonly attachmentId: string,
    readonly userId: UserId,
  ) {}
}

export type AttachmentId = string;
