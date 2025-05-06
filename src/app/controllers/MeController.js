const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {

    //GET, /me/stored/courses
    storedCourses(req, res, next) {
        let coursesQuery = Course.find({});
        if ('_sort' in req.query) {
            coursesQuery = coursesQuery.sort({
                [req.query.column]: req.query.type,

            });
        }
        Promise.all([
            coursesQuery,
            Course.findDeleted() // Tìm tất cả các khóa học đã bị xóa
        ])
            .then(([courses, deletedCourses]) => {
                // Lọc các khóa học có trạng thái deleted === true
                const filteredDeletedCourses = deletedCourses.filter(course => course.deleted === true);

                res.render('me/stored-courses', {
                    deletedCount: filteredDeletedCourses.length, // Đếm số lượng khóa học bị xóa
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