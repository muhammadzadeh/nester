import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';

export const UPLOADER_TOKEN = Symbol('uploader');
export interface Uploader {
  upload(input: UploadData): Promise<string>;
  download(path: string, visibility: AttachmentVisibility): Promise<Buffer>;
  delete(path: string, visibility: AttachmentVisibility): Promise<void>;
  getName(): string;
  getBaseURL(): string;
  getPrivateBaseURL(): string;
  getPublicBaseURL(): string;
  getPrivateBucketName(): string;
  getPublicBucketName(): string;
  isAvailable(): Promise<boolean>;
}

export class UploadData {
  readonly path!: string;
  readonly name!: string;
  readonly mimeType!: ExtendedMemeType;
  readonly data!: Buffer;
  readonly visibility!: AttachmentVisibility;
}

export class UploaderHolder {
  private static uploader: Uploader;

  public static set(v: Uploader) {
    this.uploader = v;
  }

  public static get(): Uploader {
    return this.uploader;
  }
}

export type ExtendedMemeType = {
  readonly ext: string;
  readonly mime: string;
};

export interface FileInfo {
  buffer: Buffer;
  mimeType: ExtendedMemeType;
  fileSize: number;
}

@Exception({
  errorCode: 'STORAGE_IS_UNAVAILABLE',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class StorageIsUnavailableException extends Error {}
