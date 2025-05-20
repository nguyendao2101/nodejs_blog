const redis = require('redis');

// Tạo client Redis
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
});

// Kết nối Redis Client
(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis successfully');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = client;