// Environment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// For creating dummy data (both old and new)
const mongoose = require('mongoose');
const RecentData = require('./models/recentData');
const OldData = require('./models/oldData');

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

const seedDB = async () => {
    // Deleting old data first
    await RecentData.deleteMany({});
    await OldData.deleteMany({});

    // Array of test location values
    const locationArr = [
        'Asia Pacific College: Floor 1', 
        'Asia Pacific College: Floor 3', 
        'Asia Pacific College: MPH 1',
        'Barangay Magallanes: Floor 1',
        'Barangay Magallanes: Floor 3',
        'Barangay Magallanes: Reception'
    ];

    // Creating recent data records
    for (i = 1; i <= 3; i++) {
        let currentDate = new Date();
        let previousDate = new Date();
        previousDate.setDate(currentDate.getDate() - i);
        const recentData = new RecentData({
            recordDate: previousDate,
            violationCount: Math.floor(Math.random() * 500),
            headcount: Math.floor(Math.random() * 1000),
            recordLocation: locationArr[Math.floor(Math.random() * locationArr.length)]
        });
        await recentData.save();
    }

    // Creating old data records
    for (i = 1; i <= 50; i++) {
        let currentDate = new Date();
        let previousDate = new Date();
        previousDate.setDate(currentDate.getDate() - i);
        const oldData = new OldData({
            recordDate: previousDate,
            violationCount: Math.floor(Math.random() * 500),
            headcount: Math.floor(Math.random() * 1000),
            recordLocation: locationArr[Math.floor(Math.random() * locationArr.length)]
        });
        await oldData.save();
    }
    console.log("SEEDED DATA SAVED");
}

// Executing seed function and closing connection
seedDB().then(() => {
    mongoose.connection.close();
});