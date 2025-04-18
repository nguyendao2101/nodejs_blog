const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

//newController.index

router.use('/search', siteController.show);

router.use('/', siteController.index);

module.exports = router;