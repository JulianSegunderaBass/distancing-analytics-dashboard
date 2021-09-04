// Model for current day's data
const mongoose = require('mongoose');

const CurrentDataSchema = new mongoose.Schema({
    violationCount: Number,
    headcount: Number,
});

module.exports = mongoose.model('CurrentData', CurrentDataSchema);