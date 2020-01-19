const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
    to: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
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