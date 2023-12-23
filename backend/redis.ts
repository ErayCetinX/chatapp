import Redis from 'ioredis';
import { REDISCLOUD_URL } from './constant';

const redis = process.env.NODE_ENV === 'production'
  ? new Redis({
    host: REDISCLOUD_URL
  })
  : new Redis({
    host: REDISCLOUD_URL
  });

export { redis, };