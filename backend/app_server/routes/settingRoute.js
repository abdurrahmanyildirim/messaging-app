const express = require('express')
const router = express.Router();
const settingController = require('../controllers/settingController');

router.post('/create-room', settingController.createRoom);
router.get('/get-rooms', settingController.getRooms);
router.get('/delete-room/:roomId', settingController.deleteRoom);
router.get('/get-users', settingController.getUsers);

module.exports = router;