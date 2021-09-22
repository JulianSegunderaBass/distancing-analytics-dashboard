// Environment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Required Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// Models
const RecentData = require('./models/recentData');
const OldData = require('./models/oldData');

// Old URL: mongodb://localhost:27017/distancing-data
// Atlas URL: mongodb+srv://<username>:<password>@cluster0.k7pme.mongodb.net/distancingData?retryWrites=true&w=majority
// Replace <username> and <password> with the specified credentials

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

app.set('view engine', 'ejs');
// Accessing EJS views from the views directory
app.set('views', path.join(__dirname, 'views'));
// Accessing static assets
app.use(express.static(path.join(__dirname, 'javascripts')));
app.use(express.urlencoded({ extended: true }));
// For other methods
app.use(methodOverride('_method'));

// Routes
app.get('/', async (req, res) => {
    const recentData = await RecentData.find({});
    const oldData = await OldData.find({});
    res.render('index', { recentData, oldData });
});

app.post('/', async (req, res) => {
    // Getting the start and end date from the request
    const { start, end } = req.body.dateFilter;
    
    // Slicing and parsing to get specific date values
    const startDay = parseInt(start.slice(8));
    const endDay = parseInt(end.slice(8));
    const startMonth = parseInt(start.slice(5, 7));
    const endMonth = parseInt(end.slice(5, 7));
    const startYear = parseInt(start.slice(0, 4));
    const endYear = parseInt(end.slice(0, 4));

    const recentData = await RecentData.find({});

    const oldData = await OldData.find({
        "recordDate.day": { $gte: startDay, $lte: endDay },
        "recordDate.month": { $gte: startMonth, $lte: endMonth },
        "recordDate.year": { $gte: startYear, $lte: endYear }
    });

    res.render('index', { recentData, oldData });
});

app.post('/:recordID', async (req, res) => {
    const recentData = await RecentData.findById(req.params.recordID);

    // Saving recent data as archived records
    const archivedData = new OldData({
        recordDate: recentData.recordDate,
        violationCount: recentData.violationCount,
        headcount: recentData.headcount,
    });
    await archivedData.save();

    // Deleting the record from the recent data list
    await recentData.delete();

    res.redirect('/');
});

app.delete('/:recordID', async (req, res) => {
    const record = await OldData.findByIdAndDelete(req.params.recordID);
    res.redirect('/');
});

// Setting port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
});