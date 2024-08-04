const redis = require("redis");

class Redis {
  host;
  port;
  client;

  constructor() {
    this.host = process.env.REDIS_HOST || "localhost";
    this.port = process.env.REDIS_PORT || 6379;
    this.client = null;
  }

  async getConnection() {
    if (this.client) return this.client;
    else {
      this.client = redis.createClient({
        host: this.port,
        port: this.port,
      });

      this.client.on("error", (err) => console.log("Redis Client Error", err));

      this.client.on("ready", () => console.log("Redis is ready"));

      await this.client.connect();
      await this.client.ping();

      return this.client;
    }
  }
}

module.exports = new Redis();
