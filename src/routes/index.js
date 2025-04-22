const newsRouter = require('./news'); // địa chỉ file news.js trong thư mục routes
const coursesRouter = require('./courses'); // địa chỉ file news.js trong thư mục routes
const siteRouter = require('./site'); // địa chỉ file site.js trong thư mục routes
const meRouter = require('./me'); // địa chỉ file site.js trong thư mục routes
const userRouter = require('./user'); // địa chỉ file site.js trong thư mục routes

function route(app) {

    app.use('/news', newsRouter);
    app.use('/me', meRouter);
    app.use('/user', userRouter);
    app.use('/courses', coursesRouter);
    app.use('/search', siteRouter);
    app.use('/', siteRouter);
}

module.exports = route;
