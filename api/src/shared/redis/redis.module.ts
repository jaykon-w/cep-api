import { Inject, Module } from '@nestjs/common';
import * as Redis from 'ioredis';
import { useAdapter } from '@type-cacheable/ioredis-adapter';

const REDIS_CONNECTION = 'REDIS_CONNECTION';
const client = new Redis({
  port: +process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

const RedisProvider = {
  provide: REDIS_CONNECTION,
  useValue: client,
};

export const InjectRedis = () => Inject(REDIS_CONNECTION);
export const clientAdapter = useAdapter(client);

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
