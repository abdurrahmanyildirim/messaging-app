var Room = require('../models/room');
var User = require('../models/user');

module.exports.createRoom = (async (req, res) => {

    var roomData = req.body;

    var room = await Room.findOne({ roomName: roomData.roomName })

    if (room) {
        return res.status(401).send({ message: 'Birden fazla aynı oda ismi olamaz.' })
    }

    var newRoom = new Room(roomData);
    newRoom.save((err) => {
        if (err) {
            return res.status(401).send({ message: err })
        }

        return res.status(201).send({ message: 'Yeni oda kurulumu başarılı.' })
    })

})

module.exports.getRooms = async (req, res) => {
    var rooms = await Room.find();

    return res.status(200).send(rooms);
}

module.exports.deleteRoom = async (req, res) => {
    var roomId = await req.params.roomId;

    Room.deleteOne({ _id: roomId }, (err) => {
        if (err) {
            return res.status(401).send({ message: err })
        } else {
            return res.status(200).send();
        }
    })
}

module.exports.getUsers = async (req, res) => {

    var users = await User.find();

    return res.status(201).send(users);
}