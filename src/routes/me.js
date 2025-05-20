const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
const redisCache = require('../app/middlewares/redisCache');

// Sử dụng middleware redisCache cho route /stored/courses
router.get('/stored/courses', redisCache('storedCourses', 60), meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);
router.get('/stored/news', meController.storedNews);

module.exports = router;