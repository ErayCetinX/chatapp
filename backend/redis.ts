import Redis from "ioredis";
import { REDISCLOUD_URL } from "./constant";

const redis =
  process.env.NODE_ENV === "production"
    ? new Redis({
        port: 6379,
        host: "localhost",
      })
    : new Redis({
        port: 6379,
        host: "localhost",
      });

export { redis };
