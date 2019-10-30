var ActiveUser = require('../models/activeUser');
var User = require('../models/user');
var Room = require('../models/room');
var Message = require('../models/message');

module.exports = (io) => {

    const getVisitors = () => {
        let clients = io.sockets.clients().connected;
        let sockets = Object.values(clients);
        let users = sockets.map(s => s.user);
        return users;
    };

    const emitRooms = (userId) => {
        Room.find({ isActive: true }, '-__v -messages -isActive', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                io.emit('rooms', {
                    rooms: data,
                    userId: userId
                });
            }
        }).sort('-createdDate')
    }

    const emitFriends = (id) => {
        Message.find({ $or: [{ from: id }, { to: id }] }, '-__v', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                var friend = new Object({
                    userId: Number,
                    nickName: String,
                    lastMesssageDate: Date
                });
                var friends = []
                data.forEach((item) => {
                    friend.userId = item.from == id ? item.to : item.from;
                    friend.nickName = item.from == id ? item.toNick : item.fromNick;
                    friend.lastMesssageDate = item.contents[item.contents.length - 1].sendDate;
                    friends.push(friend);
                })
                io.emit('friends', {
                    friends: friends.sort(friends.lastMesssageDate),
                    userId: id
                });
            }
        })
    }

    const emitFriendMessages = (chosenUserId, userId) => {
        Message
            .findOne({ $or: [{ from: userId, to: chosenUserId }, { from: chosenUserId, to: userId }] }, '-__v', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    var isFrom = data.from == userId ? true : false;
                    var messages = data;
                    messages.contents.forEach((item) => {
                        if (!isFrom) {
                            item.isFrom = !item.isFrom;
                        }
                    })
                    io.emit('userMessages', {
                        messages: messages.contents,
                        userId: userId
                    });
                }
            })
    }

    const emitVisitors = () => {
        io.emit("visitors", getVisitors());
    };

    const emitRoomMessages = (roomId, userId) => {
        Room.findOne({ _id: roomId }, '-__v', (err, data) => {
            if (err) {
                console.log(err)
            } else {

                io.emit('roomMessages',
                    {
                        messages: data.messages,
                        userId: userId
                    })
            }
        })
    }

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            emitVisitors();
        });

        socket.on('roomMessages', (roomId, userId) => {
            emitRoomMessages(roomId, userId);
        })

        socket.on('userMessages', (chosenUserId, userId) => {
            emitFriendMessages(chosenUserId, userId);
        })

        socket.on('message to user', () => {

        })

        socket.on('message to room', () => {
            
        })

        socket.on('friends', (id) => {
            emitFriends(id);
        })

        socket.on('rooms', (userId) => {
            emitRooms(userId);
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
