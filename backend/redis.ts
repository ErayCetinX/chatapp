import Redis from "ioredis";

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
