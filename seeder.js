// For creating dummy data (both old and new)
const mongoose = require('mongoose');
const CurrentData = require('./models/currentData');
const OldData = require('./models/oldData');

// Mongoose Connection
mongoose.connect('mongodb://localhost:27017/distancing-data', { 
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
    await CurrentData.deleteMany({});
    await OldData.deleteMany({});

    // Creating new record for "present" data
    const currentData = new CurrentData({
        violationCount: Math.floor(Math.random() * 500),
        headcount: Math.floor(Math.random() * 1000)
    });
    await currentData.save();

    // Creating old data records
    for (i = 0; i < 10; i++) {
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