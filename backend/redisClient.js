const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1", // ✅ Use ENV variable
    port: process.env.REDIS_PORT || 6379,        // ✅ Use ENV variable
    password: process.env.REDIS_PASSWORD,        // ✅ Ensure this is set
    retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", async () => {
    console.log("Connected to Redis successfully!");

    try {
        // Explicitly authenticate Redis
        if (process.env.REDIS_PASSWORD) {
            await redis.auth(process.env.REDIS_PASSWORD);
            console.log("Redis authentication successful");
        }

        // Test Redis with PING
        const pingResponse = await redis.ping();
        console.log("Redis PING response:", pingResponse);
    } catch (error) {
        console.error("Redis authentication failed:", error);
    }
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

module.exports = redis;
