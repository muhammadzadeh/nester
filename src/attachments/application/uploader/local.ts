import { Injectable } from '@nestjs/common';
import fs, { constants } from 'node:fs/promises';
import { ExceptionMapper } from '../../../common/exception';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';
import { StorageIsUnavailableException, UploadData, Uploader } from './base';
import { Configuration } from '../../../common/config';

@Injectable()
export class LocalUploader implements Uploader {
  private readonly private_base_url: string;
  private readonly public_base_url: string;

  private readonly private_dir: string;
  private readonly public_dir: string;

  private readonly local_base_url: string;

  private readonly local_storage_path: string;

  constructor({ storage }: Configuration) {
    this.local_base_url = storage.baseUrl;
    this.local_storage_path = storage.local!.uploadDir;
    this.private_base_url = storage.local!.privateBaseUrl;
    this.public_base_url = storage.local!.publicBaseUrl;
    this.private_dir = storage.local!.privateDir;
    this.public_dir = storage.local!.publicDir;
  }

  getName(): string {
    return 'local';
  }

  getBaseURL(): string {
    return this.local_base_url;
  }

  getPrivateBaseURL(): string {
    return this.private_base_url;
  }

  getPublicBaseURL(): string {
    return `${this.public_base_url}/${this.getPublicBucketName()}`;
  }

  getPrivateBucketName(): string {
    return this.private_dir;
  }
  getPublicBucketName(): string {
    return this.public_dir;
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<string> {
    const filename = `${input.path}/${input.name}.${input.mimeType.ext}`;
    const sub_path = input.visibility === AttachmentVisibility.PRIVATE ? this.private_dir : this.public_dir;
    await fs.mkdir(`${this.local_storage_path}/${sub_path}/${input.path}`, { recursive: true });
    await fs.writeFile(`${this.local_storage_path}/${sub_path}/${filename}`, input.data);
    return filename;
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not download!')
  download(path: string, visibility: AttachmentVisibility): Promise<Buffer> {
    const sub_path = visibility === AttachmentVisibility.PRIVATE ? this.private_dir : this.public_dir;
    return fs.readFile(`${this.local_storage_path}/${sub_path}/${path}`);
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not delete!')
  async delete(path: string, visibility: AttachmentVisibility): Promise<void> {
    const sub_path = visibility === AttachmentVisibility.PRIVATE ? this.private_dir : this.public_dir;
    const files = await fs.readdir(`${this.local_storage_path}/${sub_path}/${path}`);
    await Promise.all(files.filter((f) => f.includes(path)).map((f) => fs.rm(f)));
  }

  async isAvailable(): Promise<boolean> {
    await fs.access(`${this.local_storage_path}/${AttachmentVisibility.PRIVATE}/`, constants.R_OK | constants.W_OK);
    return true;
  }
}
