const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');
const redis = require('../../config/db/redis'); // Import Redis client

class MeController {
    // GET, /me/stored/courses
    storedCourses(req, res, next) {
        const cacheKey = 'storedCourses';
        console.log('storedCourses method called');

        // Kiểm tra dữ liệu trong Redis
        redis.get(cacheKey, (err, cachedData) => {
            if (err) {
                console.error('Redis get error:', err);
                return next(err);
            }

            if (cachedData) {
                console.log(`Cache hit for key: ${cacheKey}`);
                const courses = JSON.parse(cachedData);
                return res.render('me/stored-courses', {
                    deletedCount: courses.deletedCount,
                    courses: multipleMongooseToObject(courses.data),
                });
            }

            console.log(`Cache miss for key: ${cacheKey}`);
            // Nếu không có dữ liệu trong cache, truy vấn từ MongoDB
            Promise.all([
                Course.find({}).sortable(req),
                Course.findDeleted(),
            ])
                .then(([courses, deletedCourses]) => {
                    console.log('Courses from MongoDB:', courses);
                    console.log('Deleted courses from MongoDB:', deletedCourses);

                    const filteredDeletedCourses = deletedCourses.filter(course => course.deleted === true);
                    const cacheData = {
                        deletedCount: filteredDeletedCourses.length,
                        data: courses,
                    };

                    // Lưu dữ liệu vào Redis Cache với TTL (Time-To-Live) là 60 giây
                    redis.setEx(cacheKey, 60, JSON.stringify(cacheData), (err) => {
                        if (err) {
                            console.error('Error saving to Redis:', err);
                        } else {
                            console.log(`Key ${cacheKey} saved to Redis`);
                        }
                    });

                    res.render('me/stored-courses', {
                        deletedCount: filteredDeletedCourses.length,
                        courses: multipleMongooseToObject(courses),
                    });
                })
                .catch((err) => {
                    console.error('Error querying MongoDB:', err);
                    next(err);
                });
        });
    }

    // GET, /me/trash/courses
    trashCourses(req, res, next) {
        console.log('trashCourses method called');
        Course.findDeleted() // Tìm tất cả các khóa học đã bị xóa
            .then((courses) => {
                console.log('Deleted courses from MongoDB:', courses);

                // Lọc thêm nếu cần (ví dụ: chỉ hiển thị khóa học có trường cụ thể)
                const filteredCourses = courses.filter(course => course.deleted === true);

                res.render('me/trash-courses', {
                    courses: multipleMongooseToObject(filteredCourses),
                });
            })
            .catch((err) => {
                console.error('Error querying MongoDB:', err);
                next(err);
            });
    }

    // GET, /me/stored/news
    storedNews(req, res, next) {
        console.log('storedNews method called');
        res.render('me/stored-news');
    }
}

module.exports = new MeController();