const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    //GET, /me/stored/courses
    name(req, res, next) {
        res.render('user/name');
    }
}

module.exports = new UserController();