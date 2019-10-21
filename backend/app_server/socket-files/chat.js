
module.exports = (io) => {
    io.on('connection', function (socket) {
        //   socket.on('disconnect', function(){
        //     console.log('user disconnected');
        //   });

        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
        });
    });
}
