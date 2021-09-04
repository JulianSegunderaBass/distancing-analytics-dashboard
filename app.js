// Required Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
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
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    const data = await CurrentData.find({});
    // Getting first element of currentData array
    const currentData = data[0];
    const oldData = await OldData.find({});
    res.render('index', { currentData, oldData });
});

// Setting port
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
});