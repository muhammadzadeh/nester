import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Exception } from '../../../common/exception';
import { randomStringSync } from '../../../common/string';
import { now } from '../../../common/time';

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
    baseUrl: string,
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
    baseUrl?: string,
  ) {
    this.id = id ?? randomUUID();
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
    this.name = name ?? this.generateRandomString();
    this.originalName = originalName;
    this.visibility = visibility;
    this.mimeType = mimeType;
    this.size = size;
    this.isDraft = isDraft;
    this.isShared = isShared ?? false;
    this.shareToken = shareToken ?? null;
    this.uploaderId = uploaderId;
    this.baseUrl = baseUrl ?? '';
    this.path = path ?? this.getPathToStore();
    this.initialUrl();
  }

  readonly id!: string;
  deletedAt!: Date | null;
  readonly createdAt!: Date;
  updatedAt!: Date;
  readonly path!: string;
  readonly name!: string;
  readonly originalName!: string | null;
  readonly visibility!: AttachmentVisibility;
  readonly mimeType!: MimeType | null;
  readonly size!: number;
  readonly uploaderId!: string;
  url!: string;
  isDraft!: boolean;
  isShared!: boolean;
  shareToken!: string | null;

  baseUrl!: string | null;

  getPathAndName(): string {
    return `${this.path}/${this.name}.${this.mimeType?.ext}`;
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

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
    this.initialUrl();
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
    return this.visibility === AttachmentVisibility.PRIVATE
      ? `${this.baseUrl}/${this.id}`
      : `${this.baseUrl}/${this.getPathAndName()}`;
  }

  private getShareUrl(): string {
    return this.visibility === AttachmentVisibility.PRIVATE
      ? `${this.baseUrl}/share/${this.shareToken}`
      : `${this.baseUrl}/${this.getPathAndName()}`;
  }

  private initialUrl() {
    if (this.isShared && this.shareToken) {
      this.url = this.getShareUrl();
    } else {
      this.url = this.getDownloadUrl();
    }
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
