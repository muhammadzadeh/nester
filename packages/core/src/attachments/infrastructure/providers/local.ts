import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ExceptionMapper } from '../../../common/exception';
import {
  StorageIsUnavailableException,
  StorageProvider,
  StorageProviderOptions,
  UploadData,
} from '../../application/storage-provider';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly privateDir: string;
  private readonly publicDir: string;
  private readonly localStoragePath: string;

  constructor(readonly options: LocalOptions) {
    this.localStoragePath = options.localStoragePath;
    this.privateDir = options.privateDir;
    this.publicDir = options.publicDir;
    this.setup();
  }

  async setup(): Promise<void> {
    await fs.mkdir(`${this.localStoragePath}/${this.privateDir}`, {
      recursive: true,
    });
    await fs.mkdir(`${this.localStoragePath}/${this.publicDir}`, {
      recursive: true,
    });
  }

  getName(): string {
    return 'local';
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<void> {
    await fs.mkdir(`${this.localStoragePath}/${input.path}`, {
      recursive: true,
    });
    await fs.writeFile(`${this.localStoragePath}/${input.path}`, input.data);
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not download!')
  download(path: string): Promise<Buffer> {
    return fs.readFile(`${this.localStoragePath}/${path}`);
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not delete!')
  async delete(path: string): Promise<void> {
    const files = await fs.readdir(`${this.localStoragePath}/${path}`);
    await Promise.all(files.filter((f) => f.includes(path)).map((f) => fs.rm(f)));
  }
}

export interface LocalOptions extends StorageProviderOptions {
  localStoragePath: string;
  privateDir: string;
  publicDir: string;
}
