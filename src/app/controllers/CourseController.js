const Course = require('../models/Course');
const redis = require('../../config/db/redis'); // Import Redis client
const { mongooseToObject } = require('../../util/mongoose');

class CourseController {
    //GET, /courses/:slug
    show(req, res, next) {
        const cacheKey = `course:${req.params.slug}`;

        redis.get(cacheKey, (err, cachedData) => {
            if (err) return next(err);

            if (cachedData) {
                return res.render('courses/show', {
                    course: JSON.parse(cachedData),
                });
            }

            Course.findOne({ slug: req.params.slug })
                .then((course) => {
                    redis.setex(cacheKey, 60, JSON.stringify(course), (err) => {
                        if (err) console.error('Error saving to Redis:', err);
                    });

                    res.render('courses/show', {
                        course: mongooseToObject(course),
                    });
                })
                .catch(next);
        });
    }

    //GET, /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    //POST, /courses/store
    store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;

        const course = new Course(req.body);
        course
            .save()
            .then(() => {
                redis.del('storedCourses');
                res.redirect('/me/stored/courses');
            })
            .catch((error) => {
                console.log('Error saving course:', error);
                res.status(500).send('Internal Server Error');
            });
    }
    //GET, /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) => {
                res.render('courses/edit', { course: mongooseToObject(course) });

                // res.send(course);
                // res.render('courses/edit', { course: mongooseToObject(course) });
            })
            .catch(next);
    }

    //PUT, /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);

    }

    //DELETE, /courses/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    //DELETE, /courses/:id/force
    forceDestroy(req, res, next) {
        console.log('Force delete:', req.params.id);
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/me/trash/courses'))
            .catch(next);
    }

    //PATCH, /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('/me/trash/courses'))
            .catch(next);
    }

    //POST, /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('/me/stored/courses'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('/me/trash/courses'))
                    .catch(next);
                break;
            case 'deleteDestroy':
                Course.deleteMany({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('/me/trash/courses'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action not found' });
        }
    }
}

module.exports = new CourseController();