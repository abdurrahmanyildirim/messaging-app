const ActiveUser = require('../models/activeUser');
const User = require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');

module.exports = (io) => {

    const getVisitors = () => {
        const clients = io.sockets.clients().connected;
        const sockets = Object.values(clients);
        const users = sockets.map(s => s.user);
        return users;
    };

    const connectedUsers = {};

    const addRoomMessage = async (receivedData) => {
        const room = await Room.findOne({ _id: receivedData.targetRoomId }, '-__v', (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
        const user = await User.findOne({ _id: receivedData.userId }, '-__v', (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
        var message = {
            from: receivedData.userId,
            fromNick: user.nickName,
            photo: user.photo,
            content: receivedData.message,
        };

        room.messages.push(message);
        room.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
        })

        io.sockets.in(receivedData.targetRoomId).emit('message to room', message);
    }

    const emitVisitors = () => {
        io.emit("visitors", getVisitors());
    };

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
            emitVisitors();
        });

        socket.on('join room', (roomId) => {
            socket.join(roomId)
            socket.broadcast.in(roomId).emit('user joined to room', socket.user.nickName);
        })

        socket.on('leave room', (roomId) => {
            socket.leave(roomId)
            socket.broadcast.in(roomId).emit('user left from room', socket.user.nickName);
        })

        socket.on('message to room', (receivedData) => {
            addRoomMessage(receivedData)
        })

        socket.on('roomMessages', (roomId, userId) => {
            Room.findOne({ _id: roomId }, '-__v', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    connectedUsers[userId].emit('roomMessages', {
                        messages: data.messages
                    })
                }
            })
        })

        socket.on('change isRead', async (chosenUserId, userId) => {
            let message = await Message
                .findOne({ $or: [{ 'from.id': userId, 'to.id': chosenUserId }, { 'from.id': chosenUserId, 'to.id': userId }] });

            if (message) {

                const isFrom = message.from.id == userId ? true : false;

                message = message.contents.filter(content => content.isRead === false);

                message.contents.map(content => {
                    if (isFrom !== content.isFrom) {
                        content.isRead = true
                    }
                });

                message.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

        })

        socket.on('userMessages', async (chosenUserId, userId) => {
            const message = await Message.findOne(
                { $or: [{ 'from.id': userId, 'to.id': chosenUserId }, { 'from.id': chosenUserId, 'to.id': userId }] }, '-__v',
                (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });

            if (message) {
                var isFrom = message.from.id === userId ? true : false;

                message.contents.forEach((item) => {
                    if (!isFrom) {
                        item.isFrom = !item.isFrom;
                    }
                })

                connectedUsers[userId].emit('userMessages', {
                    messages: message.contents
                });
            } else {
                connectedUsers[userId].emit('userMessages', {
                    messages: null
                });
            }



        })

        socket.on('message to user', async (receivedData) => {
            let message = await Message.findOne({
                $or: [{ from: receivedData.sourceUserId, to: receivedData.targetUserId },
                { from: receivedData.targetUserId, to: receivedData.sourceUserId }]
            },
                (err) => {
                    if (err) {
                        console.log(err)
                    }
                }); // Daha önce iki kullanıcı arasında mesajlaşma olmuş mu onu kontrol ediyoruz.

            if (message) {
                const isFrom = message.from.id == receivedData.sourceUserId ? true : false;
                message.contents.push({
                    content: receivedData.message,
                    isFrom,
                    isRead: false
                })
                message.save((error) => {
                    if (error) {
                        console.log(error);
                    }
                })
            } else {
                //Bu bloğa düştüyse ilk mesaj gönderilmemiş demektir. İlk veri oluşturulur.
                const users = await User.find({ $or: [{ _id: receivedData.sourceUserId }, { _id: receivedData.targetUserId }] }, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                });

                if (users) {
                    const from, to = {};
                    users.forEach(user => {
                        if (user._id === receivedData.sourceUserId) {
                            from = {
                                id: user._id,
                                nick: user.nickName,
                                photo: user.photo
                            };
                        } else {
                            to = {
                                id: user._id,
                                nick: user.nickName,
                                photo: user.photo
                            };
                        }
                    })
                    const message = new Message({
                        from: from,
                        to: to,
                        contents: {
                            content: receivedData.message,
                            isFrom: true,
                            isRead: false
                        }
                    });
                    message.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
                // TODO : İlk mesaj hatası giderilecek...
                connectedUsers[receivedData.sourceUserId].emit('message to user', {
                    sourceId: receivedData.sourceUserId,
                    message: receivedData.message
                })

                if (connectedUsers[receivedData.targetUserId]) {
                    connectedUsers[receivedData.targetUserId].emit('message to user', {
                        targetId: receivedData.targetUserId,
                        sourceId: receivedData.sourceUserId,
                        message: receivedData.message
                    })
                }
            }
        });

        socket.on('friends', (id) => {
            Message.find({ $or: [{ 'from.id': id }, { 'to.id': id }] }, '-__v', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    let friends = [];
                    data.forEach((item) => {
                        const friend = {
                            userId: item.from.id === id ? item.to.id : item.from.id,
                            nickName: item.from.id === id ? item.to.nick : item.from.nick,
                            photo: item.from.id === id ? item.to.photo : item.from.photo,
                        }
                        const isFrom = item.from.id == id ? false : true;
                        let nonReadMessage = 0;
                        item.contents.forEach(element => {
                            if (element.isFrom === isFrom && element.isRead === false) {
                                nonReadMessage++;
                            }
                            friend.lastMesssageDate = element.sendDate;
                        });
                        friend.nonReadMessageCount = nonReadMessage;

                        friends.push(friend);
                    })

                    connectedUsers[id].emit('friends', {
                        friends: friends
                    });
                }
            })
        });

        socket.on('rooms', (userId) => {

            Room.find({ isActive: true }, '-__v -messages -isActive', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    connectedUsers[userId].emit('rooms',
                        {
                            rooms: data
                        });
                }
            }).sort('-createdDate')
        });

        socket.on('add activeUser', (identity) => {
            User.findOne({ _id: identity }, async (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    var activeUser = await new ActiveUser({
                        id: data._id,
                        fullName: (data.firstName + " " + data.lastName),
                        nickName: data.nickName,
                        photo: data.url
                    });
                    socket.user = activeUser;
                    connectedUsers[identity] = socket;
                    emitVisitors();
                }
            })
        });

        socket.on('get activeUsers', () => {
            emitVisitors();
        })

    })
}
