const Room = require('../models/room');
const User = require('../models/user');

module.exports.createRoom = (async (req, res) => {

    let roomData = req.body;

    let room = await Room.findOne({ roomName: roomData.roomName })

    if (room) {
        return res.status(401).send({ message: 'Birden fazla aynı oda ismi olamaz.' })
    }

    let newRoom = new Room(roomData);
    newRoom.save((err) => {
        if (err) {
            return res.status(401).send({ message: err })
        }

        return res.status(201).send({ message: 'Yeni oda kurulumu başarılı.' })
    })

})

module.exports.getRooms = async (req, res) => {
    const rooms = await Room.find();

    return res.status(200).send(rooms);
}

module.exports.deleteRoom = async (req, res) => {
    let roomId = await req.params.roomId;

    Room.deleteOne({ _id: roomId }, (err) => {
        if (err) {
            return res.status(401).send({ message: err })
        } else {
            return res.status(200).send();
        }
    })
}

module.exports.getUsers = async (req, res) => {

    const users = await User.find();

    return res.status(201).send(users);
}
