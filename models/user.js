const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    role: {
        type: Number,
        // 101 - admin
        // 102 - basic
        required: true
    },
    access_token: [String],
    refresh_token: [String]
});

const User = mongoose.model('User', userSchema);

module.exports = { User }