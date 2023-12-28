import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from 'ioredis';

const options = {
  host: 'redis-18832.c135.eu-central-1-1.ec2.cloud.redislabs.com',
  port: 18832,
  password: 'UOs10togvsZ3IQZoHsBV3tTnc0cqTBVS',
  retryStrategy: (times: number) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
}

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export default pubsub;