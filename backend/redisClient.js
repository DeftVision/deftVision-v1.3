const Redis = require("ioredis");

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
    password: process.env.REDIS_PASSWORD || "4hTF7h7pocHGSB&G"
});

redis.on("connect", () => {
    console.log("✅ Connected to Redis successfully!");
});

redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

module.exports = redis;
