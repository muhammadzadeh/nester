import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { IgnoreAuthorizationGuard } from '../../authenticate/infrastructure/web/decorators';
import { StorageHealthIndicator } from './storage-health.indicator';

@Controller()
@IgnoreAuthorizationGuard()
export class HealthController {
  constructor(
    private readonly memory: MemoryHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly storage: StorageHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.db.pingCheck('typeorm'),
      async () => this.memory.checkHeap('memory_heap', 2 * 1024 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 2 * 1024 * 1024 * 1024),
      async () => this.storage.isHealthy(),
    ]);
  }
}
