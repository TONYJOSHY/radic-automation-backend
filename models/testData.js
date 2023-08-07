const mongoose = require('mongoose');

const randomSchema = new mongoose.Schema({
    temp: {
        type: Number,
        required: true,
    }
});

const Random = mongoose.model('Random', randomSchema);

module.exports = { Random }