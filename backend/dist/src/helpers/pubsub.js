"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = __importDefault(require("ioredis"));
const options = {
    host: 'redis-18832.c135.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 18832,
    password: 'UOs10togvsZ3IQZoHsBV3tTnc0cqTBVS',
    retryStrategy: (times) => {
        // reconnect after
        return Math.min(times * 50, 2000);
    },
};
const pubsub = new graphql_redis_subscriptions_1.RedisPubSub({
    publisher: new ioredis_1.default(options),
    subscriber: new ioredis_1.default(options),
});
exports.default = pubsub;
//# sourceMappingURL=pubsub.js.map