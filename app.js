// Environment Variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Required Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const helper = require('./public/javascripts/helper');
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
// For other methods
app.use(methodOverride('_method'));

// !!! ROUTES !!!
app.get('/', async (req, res) => {
    const recentData = await RecentData.find({}).sort({ recordDate: -1 });
    const oldData = await OldData.find({}).sort({ recordDate: -1 });
    // Default null values for date filters
    const [startDate, endDate] = [null, null];
    // Getting aggregated values
    const totalViolations = helper.aggregateViolations(oldData);
    const totalHeadcount = helper.aggregateHeadcount(oldData);
    // Getting highest values
    const topViolations = await OldData.find({}).sort({ violationCount: -1 }).limit(3);
    const topHeadcounts = await OldData.find({}).sort({ headcount: -1 }).limit(3);

    // Saving to local app storage
    app.locals.reportRecords = oldData;
    app.locals.totalViolations = totalViolations;
    app.locals.totalHeadcount = totalHeadcount;
    app.locals.topViolations = topViolations;
    app.locals.topHeadcounts = topHeadcounts;
    app.locals.startDate = startDate;
    app.locals.endDate = endDate;

    res.render('index', { recentData, oldData, helper, startDate, endDate, totalViolations, totalHeadcount, topViolations, topHeadcounts });
});

app.post('/', async (req, res) => {
    // Getting the start and end date from the request
    const { start, end } = req.body.dateFilter;

    // Converting string date inputs to date objects
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Offsetting enddate to include end date in result
    endDate.setDate(endDate.getDate() + 1);

    // Filtering and fetching data
    const recentData = await RecentData.find({}).sort({ recordDate: -1 });
    const oldData = await OldData.find({
        recordDate: { $gte: startDate, $lte: endDate }
    }).sort({ recordDate: -1 });

    // Getting aggregated values
    const totalViolations = helper.aggregateViolations(oldData);
    const totalHeadcount = helper.aggregateHeadcount(oldData);
    
    // Getting highest values
    const topViolations = await OldData.find({
        recordDate: { $gte: startDate, $lte: endDate }
    }).sort({ violationCount: -1 }).limit(3);

    const topHeadcounts = await OldData.find({
        recordDate: { $gte: startDate, $lte: endDate }
    }).sort({ headcount: -1 }).limit(3);

    // Saving to local app storage
    app.locals.reportRecords = oldData;
    app.locals.totalViolations = totalViolations;
    app.locals.totalHeadcount = totalHeadcount;
    app.locals.topViolations = topViolations;
    app.locals.topHeadcounts = topHeadcounts;
    app.locals.startDate = startDate;
    app.locals.endDate = endDate;

    res.render('index', { recentData, oldData, helper, startDate, endDate, totalViolations, totalHeadcount, topViolations, topHeadcounts });
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

// Error handler
// app.use((err, req, res, next) => {
//     res.status(500).send(err);
// });

// Setting port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
});