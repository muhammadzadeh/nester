import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { ExceptionMapper } from '../../../common/exception';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';
import { StorageIsUnavailableException, UploadData, Uploader } from './base';
import { Configuration } from '../../../common/config';

@Injectable()
export class MinioUploader implements Uploader {
  private readonly private_base_url: string;
  private readonly public_base_url: string;

  private readonly private_bucket_name: string;
  private readonly public_bucket_name: string;

  private readonly storage: S3Client;

  constructor({ storage }: Configuration) {
    const awsMinio = storage.minio;
    this.storage = new S3Client({
      region: 'auto',
      endpoint: awsMinio!.storageEndpoint,
      credentials: {
        accessKeyId: awsMinio!.accessKeyId,
        secretAccessKey: awsMinio!.secretAccessKey,
      },
    });
    this.private_bucket_name = awsMinio!.privateBucket;
    this.public_bucket_name = awsMinio!.publicBucket;
    this.private_base_url = awsMinio!.privateBaseUrl;
    this.public_base_url = awsMinio!.publicBaseUrl;
  }

  getName(): string {
    return 'minio';
  }

  getBaseURL(): string {
    return '';
  }

  getPrivateBaseURL(): string {
    return this.private_base_url;
  }

  getPublicBaseURL(): string {
    return `${this.public_base_url}/${this.getPublicBucketName()}`;
  }

  getPrivateBucketName(): string {
    return this.private_bucket_name;
  }
  getPublicBucketName(): string {
    return this.public_bucket_name;
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not upload!')
  async upload(input: UploadData): Promise<string> {
    const filename = `${input.path}/${input.name}.${input.mimeType.ext}`;
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.getBucket(input.visibility),
      Key: filename,
      Body: input.data,
      ContentType: input.mimeType.mime,
    };

    await this.storage.send(new PutObjectCommand(uploadParams));
    return filename;
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not download!')
  async download(path: string, visibility: AttachmentVisibility): Promise<Buffer> {
    const downloadParams: GetObjectCommandInput = {
      Bucket: this.getBucket(visibility),
      Key: path,
    };

    const response = await this.storage.send(new GetObjectCommand(downloadParams));

    return await this.streamToBuffer(response.Body as Readable);
  }

  @ExceptionMapper(StorageIsUnavailableException, 'Could not delete!')
  async delete(path: string, visibility: AttachmentVisibility): Promise<void> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: this.getBucket(visibility),
      Key: path,
    };

    await this.storage.send(new DeleteObjectCommand(deleteParams));
  }

  async isAvailable(): Promise<boolean> {
    const params: ListObjectsCommandInput = {
      Bucket: this.public_bucket_name,
      MaxKeys: 1,
    };

    await this.storage.send(new ListObjectsCommand(params));
    return true;
  }
  private getBucket(visibility: AttachmentVisibility): string {
    return visibility === AttachmentVisibility.PRIVATE ? this.private_bucket_name : this.public_bucket_name;
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
