import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Exception } from '../../../common/exception';
import { UploaderHolder } from '../../application/uploader';
import { UserId } from '../../../common/types';

export class AttachmentEntity {
  constructor(
    title: string | null,
    name: string | null,
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: UserId,
  );
  constructor(
    title: string | null,
    name: string | null,
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: UserId,
    id: string,
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  );
  constructor(
    title: string | null,
    name: string | null,
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: UserId,
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id ?? randomUUID();
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.title = title;
    this.name = name;
    this.originalName = originalName;
    this.visibility = visibility;
    this.mimeType = mimeType;
    this.size = size;
    this.uploaderId = uploaderId;
    this.url = this.getDownloadUrl();
  }

  id!: string;
  deletedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  title!: string | null;
  name!: string | null;
  originalName!: string | null;
  visibility!: AttachmentVisibility;
  mimeType!: MimeType | null;
  size!: number;
  uploaderId!: UserId;
  url!: string;

  getStoredPath(): string {
    if (!this.uploaderId) {
      throw new AttachmentNotFoundException();
    }

    const filePath =
      this.visibility === AttachmentVisibility.PRIVATE
        ? `${this.uploaderId}/${this.name}.${this.mimeType?.ext}`
        : `attachments/${this.name}.${this.mimeType?.ext}`;

    return filePath;
  }

  getDownloadUrl(): string {
    return this.visibility === AttachmentVisibility.PRIVATE
      ? `${UploaderHolder.get().getPrivateBaseURL()}/common/attachments/${this.id}`
      : `${UploaderHolder.get().getPublicBaseURL()}/attachments/${this.name}.${this.mimeType?.ext}`;
  }

  isPublic() {
    return this.visibility === AttachmentVisibility.PUBLIC;
  }

  isPrivate() {
    return this.visibility === AttachmentVisibility.PRIVATE;
  }

  isImage(): boolean {
    return !!this.mimeType && ['jpg', 'png'].includes(this.mimeType?.ext);
  }
}

export enum AttachmentVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class MimeType {
  ext!: string;
  mime!: string;
}

@Exception({
  errorCode: 'ATTACHMENT_NOT_FOUND',
  statusCode: HttpStatus.NOT_FOUND,
})
export class AttachmentNotFoundException extends Error {}
