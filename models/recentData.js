// Model for current day's data
const mongoose = require('mongoose');

const RecentDataSchema = new mongoose.Schema({
    recordDate: String,
    violationCount: Number,
    headcount: Number,
});

module.exports = mongoose.model('RecentData', RecentDataSchema);