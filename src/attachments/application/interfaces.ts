import { UserId } from "../../common/types";
import { AttachmentId } from "../domain/entities/attachment-users.entity";

export interface AttachmentAccessInterface {
  grantAttachmentAccess(attachmentIds: AttachmentId[], userIds: UserId[]): Promise<void>;
  revokeAttachmentAccess(attachmentId: AttachmentId, userIds: UserId[]): Promise<void>;
  revokeAttachmentAccess(attachmentId: AttachmentId): Promise<void>;
}
