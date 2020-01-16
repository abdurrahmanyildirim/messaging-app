const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    nickName: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true },
    publicId: { type: String, trim: true },
    photo: { type: String, trim: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
