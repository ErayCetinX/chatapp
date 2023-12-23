"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const constant_1 = require("./constant");
const redis = process.env.NODE_ENV === 'production'
    ? new ioredis_1.default({
        host: constant_1.REDISCLOUD_URL
    })
    : new ioredis_1.default({
        host: constant_1.REDISCLOUD_URL
    });
exports.redis = redis;
//# sourceMappingURL=redis.js.map