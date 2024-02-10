import { Inject, Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { UPLOADER_TOKEN, Uploader } from '../../attachments/application/uploader';
import { Configuration } from '../config';

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(UPLOADER_TOKEN) private readonly uploader: Uploader,
    private readonly configuration: Configuration,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.uploader.isAvailable();
      return this.getStatus(this.configuration.storage.type, true);
    } catch (error: any) {
      throw new HealthCheckError(
        'StorageHealthIndicator failed',
        this.getStatus(this.configuration.storage.type, false, { message: error.message }),
      );
    }
  }
}
