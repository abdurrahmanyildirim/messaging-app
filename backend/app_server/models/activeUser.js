var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var activeUserSchema = new Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fullName: { type: String, required: true },
    nickName: { type: String, required: true }
});

var ActiveUser = mongoose.model('ActiveUser', activeUserSchema);

module.exports = ActiveUser;