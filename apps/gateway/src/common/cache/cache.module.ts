import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import ioRedis from 'cache-manager-ioredis';
import { Configuration } from '@repo/config';
import { CacheService } from './services';

@Global()
@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [Configuration],
			useFactory: (configService: Configuration) => ({ store: ioRedis, ...configService.globalCache }),
		}),
	],
	controllers: [],
	providers: [CacheService],
	exports: [CacheService],
})
export class CacheServiceModule {}
