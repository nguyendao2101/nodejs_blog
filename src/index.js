const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override')
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/sortMiddleware');

const route = require('./routes');
const db = require('./config/db');
const { type } = require('os');
const { types } = require('util');

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
})); // chính là middleware để xử lý dữ liệu trung gian
app.use(express.json()); // chính là middleware để xử lý dữ liệu trung gian
app.use(methodOverride('_method'));

//custom middleware
app.use(SortMiddleware);
//http logger
// app.use(morgan('combined'));
//template engine
app.engine('hbs', engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebars'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
})