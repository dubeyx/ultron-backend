const redis = require('redis');

// Create Redis client using URL from .env
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Connect immediately
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('✅ Connected to Redis');
    }
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
  }
})();

module.exports = { redisClient };
