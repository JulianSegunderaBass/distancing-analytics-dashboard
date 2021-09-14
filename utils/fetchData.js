// Environment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// For fetching and exporting data
const mongoose = require('mongoose');
const OldData = require('../models/oldData');

module.exports = async () => {
    // Mongoose Connection
    const mongoConnection = process.env.MONGODB_URL || 'mongodb://localhost:27017/distancing-data';
    mongoose.connect(mongoConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('MONGO CONNECTION OPEN');
        })
        .catch(err => {
            console.log('MONGO CONNECTION ERROR');
            console.log(err);
        });

    const oldData = await OldData.find({});
    // Returns an array of objects
    console.log(oldData);
    return oldData;
}