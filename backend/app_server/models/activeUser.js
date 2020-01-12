const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const activeUserSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fullName: { type: String, required: true },
    nickName: { type: String, required: true }
});

const ActiveUser = mongoose.model('ActiveUser', activeUserSchema);

module.exports = ActiveUser;