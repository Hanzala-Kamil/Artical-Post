const mongoose = require('mongoose');

const connectMongo = () => {
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("Not connected");
    }
}

module.exports = connectMongo