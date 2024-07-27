const mongoose = require('mongoose');
const colors = require('colors');


const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB server ${mongoose.connection.host}`.bgGreen.black)
    } catch (error) {
        console.log(`Unable to connect to Mongoose ${error}`.bgRed.white)
        
    }
}

module.exports = ConnectDB;