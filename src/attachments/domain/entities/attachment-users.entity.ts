import { UserId } from '../../../common/types';

export class AttachmentUserEntity {
  constructor(
    readonly attachmentId: AttachmentId,
    readonly userId: UserId,
  ) {}
}
export type AttachmentId = string;
