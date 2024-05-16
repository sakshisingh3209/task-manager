const mongoose = require('mongoose');
require('dotenv').config();

//defining the mongodb url

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


//get the default connection

const db = mongoose.connection;


//define event listener for database connection

db.on('connected', () => {
    console.log("Connected to MongoDB server");
})

db.on('error', (err) => {
    console.log("MongoDB connection error", err);
})

db.on('disconnected', () => {
    console.log('disconnected to MongoDB server');
})

//export it

module.exports = db;