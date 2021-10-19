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
const helper = require('./utils/helper');
// Models
const RecentData = require('./models/recentData');
const OldData = require('./models/oldData');
// Error handling
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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
// For session
const sessionConfig = {
    secret: 'temp-dashboard-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
// For flash
app.use(flash());

// For saving flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// !!! ROUTES !!!
app.get('/', catchAsync(async (req, res) => {
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
    res.render('index', { 
        recentData, 
        oldData, 
        helper, 
        startDate, 
        endDate, 
        totalViolations, 
        totalHeadcount, 
        topViolations, 
        topHeadcounts
    });
}));

app.post('/', catchAsync(async (req, res) => {
    // Getting the start and end date from the request
    const { start, end } = req.body.dateFilter;
    // Converting string date inputs to date objects
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Throwing an error if the filter is invalid
    if (startDate >= endDate) {
        throw new ExpressError('Please select a valid date range filter', 500);
    }
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
    res.render('index', { 
        recentData, 
        oldData, 
        helper, 
        startDate, 
        endDate, 
        totalViolations, 
        totalHeadcount, 
        topViolations, 
        topHeadcounts 
    });
}));

app.post('/:recordID', catchAsync(async (req, res, next) => {
    const recentData = await RecentData.findById(req.params.recordID);
    // Saving recent data as archived records
    const archivedData = new OldData({
        recordDate: recentData.recordDate,
        violationCount: recentData.violationCount,
        headcount: recentData.headcount,
        recordLocation: recentData.recordLocation
    });
    await archivedData.save();
    // Deleting the record from the recent data list
    await recentData.delete();
    req.flash('success', 'Successfully archived record.');
    res.redirect('/');
}));

app.delete('/:recordID', catchAsync(async (req, res) => {
    const record = await OldData.findByIdAndDelete(req.params.recordID);
    req.flash('success', 'Successfully deleted record.');
    res.redirect('/');
}));

// Error handler
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'ERROR'} = err;
    if (!err.message) err.message = 'Something went wrong.';
    req.flash('error', `Code ${statusCode}: ${message}`);
    res.redirect('/');
});

// Setting port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
});