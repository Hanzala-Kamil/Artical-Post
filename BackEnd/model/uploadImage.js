const mongoose = require('mongoose');

const uploadImage = new mongoose.Schema({
    path: {
        type: String,
        required: true
    }
});

const imageData = mongoose.model('images', uploadImage);

module.exports = imageData;