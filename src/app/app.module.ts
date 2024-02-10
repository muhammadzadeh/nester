import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'common/guards';
import typeormOptions from 'common/typeorm';
import { Queue } from 'bull';
import { WinstonModule } from 'nest-winston';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'node:path';
import { AttachmentsModule } from '../attachments/infrastructure/attachments.module';
import { AuthenticationModule } from '../authenticate/infrastructure/authentication.module';
import { CacheServiceModule } from '../common/cache/cache.module';
import { CaptchaModule } from '../common/captcha/captcha.module';
import { ConfigModule, Configuration } from '../common/config';
import { HealthController } from '../common/health/health.controller';
import { StorageHealthIndicator } from '../common/health/storage-health.indicator';
import { RabbitMQModule } from '../common/rabbit/infrastructure/rabbit-mq.module';
import { ThrottlerStorageRedisService } from '../common/throttler';
import { DATABASE_SEEDER_TAG } from '../common/database';
import { UserModule } from '../users/infrastructure/users.module';
import { NotificationsModule } from '../notifications/infrastructure/notifications.module';

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      inject: [Configuration],
      useFactory: ({ logger, app }: Configuration) => ({
        transports: logger.transports(app),
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '../i18n/'),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
    }),
    TypeOrmModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configService: Configuration) => ({ ...configService.database, ...typeormOptions }),
    }),
    BullModule.forRootAsync({
      inject: [Configuration],
      useFactory: async (configService: Configuration) => ({
        redis: configService.globalCache,
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configService: Configuration) => [
        {
          ...configService.throttling,
          storage: new ThrottlerStorageRedisService({ ...configService.globalCache }),
        },
      ],
    }),
    RabbitMQModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configuration: Configuration) => ({ ...configuration.rabbit }),
    }),
    BullModule.registerQueue({
      name: 'jobs',
    }),
    CacheServiceModule,
    ScheduleModule.forRoot(),
    TerminusModule,
    AttachmentsModule,
    AuthenticationModule,
    CaptchaModule,
    AuthModule,
    UserModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [DiscoveryService, StorageHealthIndicator],
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    private readonly discovery: DiscoveryService,
    @InjectQueue('jobs') private queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    const jobs = await this.queue.getRepeatableJobs();
    for (const job of jobs) {
      await this.queue.removeRepeatableByKey(job.key);
    }
  }

  async onApplicationBootstrap() {
    const wrappers = this.discovery.getProviders({});

    for (const wrapper of wrappers) {
      if (!wrapper.metatype || !Reflect.getMetadata(DATABASE_SEEDER_TAG, wrapper.metatype)) {
        continue;
      }
      await wrapper.instance.run();
    }
  }
}
