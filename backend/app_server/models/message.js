var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var messageSchema = new Schema({
    from: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;