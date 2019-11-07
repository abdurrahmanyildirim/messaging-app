var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    nickName: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true }
});

var User = mongoose.model('User', userSchema);

module.exports = User;