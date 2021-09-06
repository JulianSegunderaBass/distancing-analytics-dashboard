// For fetching and exporting data
const mongoose = require('mongoose');
const OldData = require('../models/oldData');

module.exports = async () => {
    // Mongoose Connection
    mongoose.connect('mongodb+srv://<username>:<password>@cluster0.k7pme.mongodb.net/distancingData?retryWrites=true&w=majority', {
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