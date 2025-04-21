const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    // GET /news
    async index(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('home', {
                courses: multipleMongooseToObject(courses),
            });
        } catch (err) {
            next(err);
        }
    }

    // GET /search
    show(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController();
