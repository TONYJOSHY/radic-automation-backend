const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    access_token: String,
    refresh_token: String
});

// userSchema.method.generateToken = function () {
//     const user = this;
//     const access_token = jwt.sign({
//         _id: user._id,
//         username: user.username,
//         password: user.password
//     }, process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: '12h' })
// }

const User = mongoose.model('User', userSchema);

module.exports = { User }