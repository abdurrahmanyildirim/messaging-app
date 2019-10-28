var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var db = require('./app_server/models/db');
var bodyParser = require('body-parser');
var cors = require('cors');
var Message = require('./app_server/models/message');
var User = require('./app_server/models/user');
var Room = require('./app_server/models/room');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

require('./app_server/routes/routeManager')(app);
require('./app_server/socket-files/chat')(io);

// Room.findOne({ _id: '5db426bebfe4612a88c8fa64' }, '-__v', (err, data) => {
//   if (err) {
//     console.log(err)
//   } else {
//     var message = {
//       from: '5db2c086c8372a2d880a4edc',
//       fromNick: 'abdu',
//       content: 'Ekonomi : Sınırsızihtiyaçlarınsınırlıihtiyaçlarilekarşılanmayaçalışılmasıdır.Sınırsızihtiyaçlarınsınırlıihtiyaçlarilekarşılanmayaçalışılmasıdır.Sınırsızihtiyaçlarınsınırlıihtiyaçlarilekarşılanmayaçalışılmasıdır.',
//       sendDate: Date.now()
//     }
//     data.messages.push(message);
//     data.save((err) => {
//       if (err) {
//         console.log(err);
//       }
//     })
//   }
// })

// Message
//   .findOne(
//     {
//       $or:
//         [{ from: '5db2b9174c639031144e50cf', to: '5db2c086c8372a2d880a4edc' },
//         { from: '5db2c086c8372a2d880a4edc', to: '5db2b9174c639031144e50cf' }]
//     },
//     (err, data) => {
//       if (err) {
//         console.log(err)
//       } else {

//         if (data) {
//           var isFrom = data.from == '5db2c086c8372a2d880a4edc' ? true : false;
//           data.contents.push({
//             content: 'Merhaba',
//             sendDate: Date.now(),
//             isFrom: isFrom,
//             isRead: false
//           })
//           data.save((error) => {
//             if (error) {
//               console.log(error);
//             }
//           })
//           console.log(data.contents)
//         } else {
//           User.find({ $or: [{ _id: '5db2b9174c639031144e50cf' }, { _id: '5db2c086c8372a2d880a4edc' }] }, (err, data) => {
//             if (err) {
//               console.log(err);
//             } else {
//               var fromNick;
//               var toNick;
//               data.forEach((item) => {
//                 if (item._id == '5db2b9174c639031144e50cf') {
//                   fromNick = item.nickName;
//                 } else {
//                   toNick = item.nickName;
//                 }
//               })
//               var message = new Message({
//                 from: '5db2b9174c639031144e50cf',
//                 to: '5db2c086c8372a2d880a4edc',
//                 fromNick: fromNick,
//                 toNick: toNick,
//                 contents: {
//                   content: 'Merhaba',
//                   sendDate: Date.now(),
//                   isFrom: true,
//                   isRead: false
//                 }
//               });

//               message.save((err) => {
//                 if (err) {
//                   console.log(err);
//                 }
//               })
//             }
//           })
//         }
//       }
//     })

http.listen(port, function () {
  console.log('listening on *:' + port);
});
