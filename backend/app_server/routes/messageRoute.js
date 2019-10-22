var express = require('express')
var router = express.Router();
var messageController = require('../controllers/messageController');

router.get('/main-page', messageController.mainPage);

module.exports = router;