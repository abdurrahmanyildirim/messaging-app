var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var roomSchema = new Schema({
    roomName: { type: String, required: true, trim: true, unique: true },
    messages: [
        {
            from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            fromNick: { type: String, required: true },
            content: { type: String, require: true, trim: true },
            sendDate: { type: Date, require: true, default: Date.now() }
        }
    ],
    createdDate: { type: Date, required: true, default: Date.now() },
    isActive: { type: Boolean, required: true, default: true }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;