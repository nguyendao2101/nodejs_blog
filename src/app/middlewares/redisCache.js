const redis = require('../../config/db/redis');

function redisCache(key, ttl) {
    return (req, res, next) => {
        redis.get(key, (err, cachedData) => {
            if (err) return next(err);

            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            console.log(`Middleware redisCache called for key: storedCourses`);
            res.sendResponse = res.json;
            res.json = (body) => {
                redis.setEx(key, ttl, JSON.stringify(body));
                res.sendResponse(body);
            };
            next();
        });
    };
}

module.exports = redisCache;