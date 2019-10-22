var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./app_server/models/db');
var bodyParser = require('body-parser');
var User = require('./app_server/models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app_server/routes/routeManager')(app);
require('./app_server/socket-files/chat')(io);

http.listen(port, function () {
  console.log('listening on *:' + port);
});
