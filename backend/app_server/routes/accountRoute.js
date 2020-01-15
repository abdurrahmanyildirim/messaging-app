const express = require('express')
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/upload', accountController.imageUpload);

module.exports = router;