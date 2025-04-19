const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

//connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
})); // chính là middleware để xử lý dữ liệu trung gian
app.use(express.json()); // chính là middleware để xử lý dữ liệu trung gian
//http logger
// app.use(morgan('combined'));
//template engine
app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
})