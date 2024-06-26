import { ServiceUnavailableException } from '@nestjs/common';
import { AttachmentVisibility } from '../domain/entities/attachments.entity';

export const STORAGE_PROVIDER_TOKEN = Symbol('StorageProvider');
export interface StorageProvider {
  upload(input: UploadData): Promise<void>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getName(): string;
  setup(): Promise<void>;
}

export class UploadData {
  readonly path!: string;
  readonly mimeType!: ExtendedMemeType;
  readonly data!: Buffer;
}

export type ExtendedMemeType = {
  readonly ext: string;
  readonly mime: string;
};

export interface FileInfo {
  fileBuffer: Buffer;
  mimeType: ExtendedMemeType;
  fileSize: number;
  originalName: string;
}

export interface StorageProviderOptions {}

export class StorageIsUnavailableException extends ServiceUnavailableException {}
