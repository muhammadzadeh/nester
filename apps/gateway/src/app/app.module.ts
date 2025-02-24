import { BullModule, InjectQueue } from '@nestjs/bull';
import { Logger, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptchaModule } from '@package/captcha';
import { ConfigModule, Configuration } from '@package/config';
import { RabbitMQModule } from '@package/rabbit/rabbit-mq.module';
import { DATABASE_SEEDER_TAG } from '@package/types';
import { Queue } from 'bull';
import { WinstonModule } from 'nest-winston';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'node:path';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CacheServiceModule } from '../common/cache/cache.module';
import { AuthModule } from '../common/guards';
import { HealthController } from '../common/health/health.controller';
import { ThrottlerStorageRedisService } from '../common/throttler';
import typeormOptions from '../common/typeorm';
import { CountryModule } from '../countries/country.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfileModule } from '../users/profiles/profiles.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
	imports: [
		ConfigModule.forRootAsync({
			inject: [],
			useFactory: () => ({ filePath: '../../apps/gateway/config.yml' }),
		}),
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
			resolvers: [
				{
					use: QueryResolver,
					options: ['lang'],
				},
				AcceptLanguageResolver,
				new HeaderResolver(['x-lang']),
			],
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
		ProfileModule,
		NotificationsModule,
		CountryModule,
		WorkspacesModule,
	],
	controllers: [HealthController],
	providers: [DiscoveryService],
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(AppModule.name);

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
			wrapper.instance.run().catch((error: any) => this.logger.error(error.message));
		}
	}
}
