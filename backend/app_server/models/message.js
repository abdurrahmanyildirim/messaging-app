const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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
    to: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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