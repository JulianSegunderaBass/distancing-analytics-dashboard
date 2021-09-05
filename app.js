// Required Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// Models
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
    const data = await CurrentData.find({});
    // Getting first element of currentData array
    const currentData = data[0];
    const oldData = await OldData.find({});
    res.render('index', { currentData, oldData });
});

app.post('/', async (req, res) => {
    const date = new Date();
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    const data = await CurrentData.find({});
    // Getting first element of currentData array
    const currentData = data[0];

    // Saving current data as archived record
    const archivedData = new OldData({
        recordDate: `${month}-${day}-${year}`,
        violationCount: currentData.violationCount,
        headcount: currentData.headcount
    });
    await archivedData.save();

    // Deleting the currentData record
    const deleteRecord = await CurrentData.deleteMany({});

    // Creating new random current data
    const newData = new CurrentData({
        violationCount: Math.floor(Math.random() * 500),
        headcount: Math.floor(Math.random() * 1000)
    });
    await newData.save();

    res.redirect('/');
});

app.delete('/:recordID', async (req, res) => {
    const record = await OldData.findByIdAndDelete(req.params.recordID);
    res.redirect('/');
});

// Setting port
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
});