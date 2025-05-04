const mongoose = require('mongoose');
const slugify = require('slugify');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: { type: String, default: 'Not name', maxlength: 255, required: true },
    description: { type: String, default: 'Not description', maxlength: 600 },
    image: { type: String, default: 'Not image', maxlength: 255 },
    videoId: { type: String, default: 'Not video', maxlength: 255 },
    slug: { type: String, unique: true },
    level: { type: String, default: 'Not level', maxlength: 255 },
    totalLesson: { type: String, default: 'Not totalLesson', maxlength: 255 },
    totalTime: { type: String, default: 'Not totalTime', maxlength: 255 },
}, {
    timestamps: true,
});

// Tạo slug trước khi lưu nếu chưa có
CourseSchema.pre('save', async function (next) {
    if (!this.slug) {
        let baseSlug = slugify(this.name, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        const Course = mongoose.model('Course', CourseSchema);

        // Lặp đến khi không trùng
        while (await Course.findOne({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        this.slug = slug;
    }

    next();
});

// add plugin
CourseSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });


module.exports = mongoose.model('Course', CourseSchema);
