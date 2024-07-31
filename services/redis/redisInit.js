const redis = require("redis");

const redisInit = async () => {
  const redisClient = redis.createClient(6379);
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  redisClient.on("ready", () => console.log("Redis is ready"));

  await redisClient.connect();

  await redisClient.ping();
};

module.exports = redisInit;
