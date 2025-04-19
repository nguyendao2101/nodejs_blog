const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String, default: 'Not name;', maxlength: 255 },
    description: { type: String, default: 'Not description;', maxlength: 600 },
    image: { type: String, default: 'Not image', maxlength: 255 },
    createAt: { type: Date, defauth: Date.now },
    upateAt: { type: Date, defauth: Date.now },
});

module.exports = mongoose.model('Course', Course);