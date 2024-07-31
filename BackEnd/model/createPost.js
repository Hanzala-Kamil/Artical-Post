const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'images',
        required: true
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
        }
    ],
    comments: [
        {
            user: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            comment: {
                type: String,
            }   
        }
    ],

});

const post = mongoose.model('post', postSchema);

module.exports = post;