const Redis = require("ioredis");

console.log("DEBUG: Checking environment variables for Redis...");
console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);
console.log(`REDIS_PORT: ${process.env.REDIS_PORT}`);
console.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? "***** (HIDDEN)" : "Not Set"}`);

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.trim() !== "" ? process.env.REDIS_PASSWORD : undefined,
    connectTimeout: 10000,
};

console.log("Final Redis config:", JSON.stringify(redisConfig, null, 2));

const redis = new Redis(redisConfig);

redis.on("connect", () => {
    console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
    console.log("Redis connection error:",err);
});


module.exports = redis;
