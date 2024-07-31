const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    },
    email : {
    type: String,
    required: true,
    unique: true
    },
    password : {
        type: String,
        required: true
    },
    verify : {
        type: String,
        default: "Not Active"
    },
    role: {
        type : String,
        default: "user"
    },
    postCount : {
        type: Number,
        default: 0
    }
})
const user = mongoose.model( "user" , userSchema )

module.exports = user;