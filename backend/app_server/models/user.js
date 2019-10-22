var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
    nickName: { type: String, required: true, unique: true },
    role: { type: String, required: true }
});

var User = mongoose.model('User', userSchema);

module.exports = User;