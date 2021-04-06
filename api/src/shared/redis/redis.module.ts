import { Inject, Module } from '@nestjs/common';
import * as Redis from 'ioredis';
import { useAdapter } from '@type-cacheable/ioredis-adapter';
import * as R from 'ramda';

export const REDIS_CONNECTION = 'REDIS_CONNECTION';

const client = R.memoizeWith(
  R.identity,
  () =>
    new Redis({
      port: +process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    }),
);

const RedisProvider = {
  provide: REDIS_CONNECTION,
  useFactory: client,
};

export const InjectRedis = () => Inject(REDIS_CONNECTION);
export const clientAdapter = {
  client: R.memoizeWith(R.identity, () => useAdapter(client())),
};

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
