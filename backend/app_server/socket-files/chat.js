var ActiveUser = require('../models/activeUser');
var User = require('../models/user');
var Room = require('../models/room');

module.exports = (io) => {

    const getVisitors = () => {
        let clients = io.sockets.clients().connected;
        let sockets = Object.values(clients);
        let users = sockets.map(s => s.user);
        return users;
    };

    const emitRooms = () => {
        Room.find({ isActive: true }, '-__v -messages -isActive', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                io.emit('rooms', data);
            }
        }).sort('-createdDate')
    }

    const emitVisitors = () => {
        io.emit("visitors", getVisitors());
    };

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            emitVisitors();
        });

        socket.on('rooms', () => {
            emitRooms();
        })

        socket.on('add activeUser', (identity) => {
            User.findOne({ _id: identity }, async (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    var activeUser = await new ActiveUser({
                        id: data._id,
                        fullName: (data.firstName + " " + data.lastName),
                        nickName: data.nickName
                    });
                    socket.user = activeUser;
                    emitVisitors();
                }
            })
        });

        socket.on('get activeUsers', function () {
            emitVisitors();
        })
    });
}
