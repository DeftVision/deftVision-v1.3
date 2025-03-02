const Redis = require("ioredis");

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000),
};

// Only add password if it exists
if (process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.trim() !== "") {
    redisConfig.password = process.env.REDIS_PASSWORD;
}

// Initialize Redis client
const redis = new Redis(redisConfig);

redis.on("connect", async () => {
    console.log("Connected to Redis successfully!");

    // Test Redis connection
    try {
        const pingResponse = await redis.ping();
        console.log("Redis PING response:", pingResponse);
    } catch (error) {
        console.error("Redis ping failed:", error);
    }
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

module.exports = redis;
