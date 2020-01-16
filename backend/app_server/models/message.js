const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
        nick: { type: String, required: true, trim: true },
        photo: String
    },
    to: {
        id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
        nick: { type: String, required: true, trim: true },
        photo: String
    },
    fromNick: { type: String, required: true },
    toNick: { type: String, required: true },
    contents: [
        {
            content: { type: String, required: true, trim: true },
            sendDate: { type: Date, required: true, default: Date.now() },
            isFrom: { type: Boolean, require: true },
            isRead: { type: Boolean, required: true }
        }]
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;