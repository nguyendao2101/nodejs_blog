const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    storedCourses(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('me/stored-courses', {
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(next);
    }

    trashCourses(req, res, next) {
        Course.findDeleted() // Tìm tất cả các khóa học đã bị xóa
            .then((courses) => {
                // Lọc thêm nếu cần (ví dụ: chỉ hiển thị khóa học có trường cụ thể)
                const filteredCourses = courses.filter(course => course.deleted === true);

                res.render('me/trash-courses', {
                    courses: multipleMongooseToObject(filteredCourses),
                });
            })
            .catch(next);
    }

    storedNews(req, res, next) {
        res.render('me/stored-news');
    }
}

module.exports = new MeController();