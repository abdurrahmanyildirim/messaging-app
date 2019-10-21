var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var roomSchema = new Schema({
    roomName: { type: String, required: true },
    messages: [
        {
            from: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
            content: { type: String, require: true },
            sendDate: { type: Date, require: true }
        }
    ],
    createdDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;