var ActiveUser = require('../models/activeUser');
var User = require('../models/user');

module.exports = (io) => {

    const getVisitors = () => {
        let clients = io.sockets.clients().connected;
        let sockets = Object.values(clients);
        let users = sockets.map(s => s.user);
        return users;
    };

    const emitVisitors = () => {
        io.emit("visitors", getVisitors());
    };

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            emitVisitors();
        });

        socket.on('add activeUser', (identity) => {
            User.findOne({ _id: identity }, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    var activeUser = new ActiveUser({
                        id: data._id,
                        fullName: (data.firstName + " " + data.lastName),
                        nickName: data.nickName
                    });
                    socket.user = activeUser;
                    emitVisitors();
                }
            })
        })

        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });

        socket.on('message', (msg) => {
            io.emit('message', msg);
        })
    });
}
