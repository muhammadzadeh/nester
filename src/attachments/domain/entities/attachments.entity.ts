import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Exception } from '../../../common/exception';
import { randomStringSync } from '../../../common/utils';

export class AttachmentEntity {
  constructor(
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: string,
    isDraft: boolean,
  );
  constructor(
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: string,
    isDraft: boolean,
    path: string,
    name: string | null,
    isShared: boolean,
    shareToken: string | null,
    id: string,
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  );
  constructor(
    originalName: string | null,
    size: number,
    visibility: AttachmentVisibility,
    mimeType: MimeType | null,
    uploaderId: string,
    isDraft: boolean,
    path?: string,
    name?: string | null,
    isShared?: boolean,
    shareToken?: string | null,
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id ?? randomUUID();
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.name = name ?? this.generateRandomString();
    this.originalName = originalName;
    this.visibility = visibility;
    this.mimeType = mimeType;
    this.size = size;
    this.isDraft = isDraft;
    this.isShared = isShared ?? false;
    this.shareToken = shareToken ?? null;
    this.uploaderId = uploaderId;
    this.path = path ?? this.getPathToStore();
    this.url = this.getDownloadUrl();
  }

  id!: string;
  deletedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  path!: string;
  name!: string;
  originalName!: string | null;
  visibility!: AttachmentVisibility;
  mimeType!: MimeType | null;
  size!: number;
  uploaderId!: string;
  url!: string;
  isDraft!: boolean;
  isShared!: boolean;
  shareToken!: string | null;

  getPathAndName(): string {
    return `${this.path}/${this.name}${this.mimeType?.ext}`;
  }

  changeToShareableUrl(): void {
    this.url =
      this.visibility === AttachmentVisibility.PRIVATE ? `/share/${this.shareToken}` : `/${this.getPathAndName()}`;
  }

  isPrivatelyShared() {
    return this.isPrivate() && this.isShared;
  }

  isPublic() {
    return this.visibility === AttachmentVisibility.PUBLIC;
  }

  isPrivate() {
    return this.visibility === AttachmentVisibility.PRIVATE;
  }

  async updateSharedFlag(isShared: boolean): Promise<void> {
    this.isShared = isShared;
    const randomString = this.generateRandomString();
    const timestamp = Date.now();
    if (isShared) {
      this.shareToken = `${this.id}-${randomString}-${timestamp}`;
    } else {
      this.shareToken = null;
    }
  }

  private generateRandomString(): string {
    return randomStringSync({ length: 100, type: 'alphanumeric' });
  }

  private getPathToStore(): string {
    const filePath =
      this.visibility === AttachmentVisibility.PRIVATE ? `private/${this.uploaderId}` : `public/attachments`;

    return filePath;
  }

  private getDownloadUrl(): string {
    return this.visibility === AttachmentVisibility.PRIVATE ? `/${this.id}` : `/${this.getPathAndName()}`;
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
