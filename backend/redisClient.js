import { createClient } from "redis";

const redisClient = createClient({
    socket: {
        host: "3.132.32.218",  // Your EC2 Redis server IP
        port: 6379,            // Default Redis port
    },
    password: "***REMOVED***", // Redis password
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
    console.log("✅ Connected to Redis!");
})();

export default redisClient;

