import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Store } from 'cache-manager';
import { Redis } from 'ioredis';
interface RedisStore extends Store {
  getClient: () => Redis;
}

export interface RedisCache extends Cache {
  store: RedisStore;
}

@Injectable()
export class CacheService {
  private readonly redis_client: Redis;

  constructor(@Inject(CACHE_MANAGER) cacheManager: RedisCache) {
    this.redis_client = cacheManager.store.getClient();
  }

  getRedisClient(): Redis {
    return this.redis_client;
  }
}
