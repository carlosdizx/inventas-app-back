import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export default class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public set = async (key: string, value: any, ttl?: number) => {
    await this.cacheManager.set(key, value, ttl);
  };

  public get = async (key: string) => {
    return await this.cacheManager.get(key);
  };

  public del = async (key: string) => {
    await this.cacheManager.del(key);
  };
}
