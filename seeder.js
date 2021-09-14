// Environment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// For creating dummy data (both old and new)
const mongoose = require('mongoose');
const RecentData = require('./models/recentData');
const OldData = require('./models/oldData');

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URL, { 
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

    // Creating recent data records
    for (i = 0; i < 3; i++) {
        const date = new Date();
        const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
        const recentData = new RecentData({
            recordDate: `${month}-${day}-${year}`,
            violationCount: Math.floor(Math.random() * 500),
            headcount: Math.floor(Math.random() * 1000)
        });
        await recentData.save();
    }

    // Creating old data records
    for (i = 0; i < 15; i++) {
        const date = new Date();
        const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
        const oldData = new OldData({
            recordDate: `${month}-${day}-${year}`,
            violationCount: Math.floor(Math.random() * 500),
            headcount: Math.floor(Math.random() * 1000)
        });
        await oldData.save();
    }
    console.log("SEEDED DATA SAVED");
}

// Executing seed function and closing connection
seedDB().then(() => {
    mongoose.connection.close();
});