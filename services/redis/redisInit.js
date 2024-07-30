const redis = require("redis");

const redisClient = redis.createClient(6379);

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis server online"));

module.exports = redisClient;
