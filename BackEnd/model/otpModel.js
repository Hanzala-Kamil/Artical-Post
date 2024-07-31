const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email : {
    type: String,
    required: true,
    unique: true
    },
    otp : {
        type: String,
    }
})
const optUser = mongoose.model( "verifyOpt" , otpSchema )

module.exports = optUser;