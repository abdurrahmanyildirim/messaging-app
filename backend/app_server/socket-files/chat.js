const ActiveUser = require('../models/activeUser');
const User = require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');

module.exports = (io) => {

    const getVisitors = () => {
        let clients = io.sockets.clients().connected;
        let sockets = Object.values(clients);
        let users = sockets.map(s => s.user);

        return users;
    };

    const connectedUsers = {};

    const addRoomMessage = (receivedData) => {
        Room.findOne({ _id: receivedData.targetRoomId }, '-__v', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                User.findOne({ _id: receivedData.userId }, '-__v', (err, user) => {
                    if (err) {
                        console.log(err)
                    }
                    var message = {
                        from: receivedData.userId,
                        fromNick: user.nickName,
                        content: receivedData.message,
                        sendDate: Date.now()
                    }
                    data.messages.push(message);
                    data.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                    })

                    io.sockets.in(receivedData.targetRoomId).emit('message to room', message);
                })

            }
        })

    }

    const emitVisitors = () => {
        io.emit("visitors", getVisitors());
    };

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            emitVisitors();
        });

        socket.on('join room', (roomId) => {
            socket.join(roomId)
            socket.broadcast.in(roomId).emit('user joined to room', socket.user.nickName);
        })

        socket.on('leave room', (roomId) => {
            socket.leave(roomId)
            socket.in(roomId).emit('user left from room', socket.user.nickName);
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
            var arr = await Message
                .findOne({ $or: [{ from: userId, to: chosenUserId }, { from: chosenUserId, to: userId }] });
            
            if (arr) {
                var isFrom = arr.from == userId ? true : false;
                // False olan mesaj sayısının bulunması için filter yapıyoruz.
                let messages = arr.contents.filter((item) => {
                    return item.isRead === false;
                })

                var nonMessageCount = messages.length;
                for (let i = arr.contents.length - 1; i >= arr.contents.length - nonMessageCount; i--) {
                    if (isFrom != arr.contents[i].isFrom) {
                        arr.contents[i].isRead = true;
                    }
                }
                arr.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

        })

        socket.on('userMessages', (chosenUserId, userId) => {
            Message
                .findOne({ $or: [{ from: userId, to: chosenUserId }, { from: chosenUserId, to: userId }] }, '-__v', (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (data) {
                            var isFrom = data.from == userId ? true : false;
                            let messages = data;

                            messages.contents.forEach((item) => {
                                if (!isFrom) {
                                    item.isFrom = !item.isFrom;
                                }
                            })

                            connectedUsers[userId].emit('userMessages', {
                                messages: messages.contents
                            });
                        } else {
                            connectedUsers[userId].emit('userMessages', {
                                messages: null
                            });
                        }

                    }
                })
        })

        socket.on('message to user', (receivedData) => {
            Message
                .findOne(
                    {
                        $or:
                            [{ from: receivedData.sourceUserId, to: receivedData.targetUserId },
                            { from: receivedData.targetUserId, to: receivedData.sourceUserId }]
                    },//iki kullanıcı arasında daha önce konuşma olduysa direkt eklenir.
                    (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {

                            if (data) {
                                var isFrom = data.from == receivedData.sourceUserId ? true : false;
                                data.contents.push({
                                    content: receivedData.message,
                                    isFrom: isFrom,
                                    isRead: false
                                })
                                data.save((error) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                })
                            } else {//Bu bloğa düştüyse ilk mesaj gönderilmemiş demektir. İlk veri oluşturulur.
                                User.find({ $or: [{ _id: receivedData.sourceUserId }, { _id: receivedData.targetUserId }] }, (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var fromNick;
                                        var toNick;
                                        data.forEach((item) => {
                                            if (item._id == receivedData.sourceUserId) {
                                                fromNick = item.nickName;
                                            } else {
                                                toNick = item.nickName;
                                            }
                                        })
                                        var message = new Message({
                                            from: receivedData.sourceUserId,
                                            to: receivedData.targetUserId,
                                            fromNick: fromNick,
                                            toNick: toNick,
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
                                })
                            }
                        }
                    }).then(() => {
                        connectedUsers[receivedData.sourceUserId].emit('message to user', {
                            sourceId: receivedData.sourceUserId,
                            message: receivedData.message
                        })
                    }).then(() => {
                        if (connectedUsers[receivedData.targetUserId]) {
                            connectedUsers[receivedData.targetUserId].emit('message to user', {
                                targetId: receivedData.targetUserId,
                                sourceId: receivedData.sourceUserId,
                                message: receivedData.message
                            })
                        }
                    })
        })

        socket.on('friends', (id) => {
            Message.find({ $or: [{ from: id }, { to: id }] }, '-__v', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    let friends = [];
                    data.forEach((item) => {
                        var friend = {
                            userId: item.from == id ? item.to : item.from,
                            nickName: item.from == id ? item.toNick : item.fromNick
                        }
                        var isFrom = item.from == id ? false : true;
                        let nonReadMessage = 0;
                        item.contents.forEach(element => {
                            if (element.isFrom == isFrom && element.isRead == false) {
                                nonReadMessage++;
                            }
                            friend.lastMesssageDate = element.sendDate
                        });
                        friend.nonReadMessageCount = nonReadMessage;

                        friends.push(friend);
                    })

                    connectedUsers[id].emit('friends', {
                        friends: friends
                    });
                }
            })
        })

        socket.on('rooms', (userId) => {

            Room.find({ isActive: true }, '-__v -messages -isActive', (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    connectedUsers[userId].emit('rooms',
                        {
                            rooms: data
                        });
                }
            }).sort('-createdDate')
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
                    connectedUsers[identity] = socket;
                    emitVisitors();
                }
            })
        });

        socket.on('get activeUsers', function () {
            emitVisitors();
        })
    });
}
