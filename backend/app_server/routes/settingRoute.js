var express = require('express')
var router = express.Router();
var settingController = require('../controllers/settingController');

router.post('/create-room', settingController.createRoom);
router.get('/get-rooms', settingController.getRooms);
router.get('/delete-room/:roomId', settingController.deleteRoom);
router.get('/get-users', settingController.getUsers);

module.exports = router;