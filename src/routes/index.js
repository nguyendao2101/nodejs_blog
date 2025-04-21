const newsRouter = require('./news'); // địa chỉ file news.js trong thư mục routes
const coursesRouter = require('./courses'); // địa chỉ file news.js trong thư mục routes
const siteRouter = require('./site'); // địa chỉ file site.js trong thư mục routes

function route(app) {
    app.use('/', siteRouter);
    app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/search', siteRouter);
}

module.exports = route;
