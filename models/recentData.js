// Model for current day's data
const mongoose = require('mongoose');

const RecentDataSchema = new mongoose.Schema({
    recordDate: {
        month: Number,
        day: Number,
        year: Number
    },
    violationCount: Number,
    headcount: Number,
});

module.exports = mongoose.model('RecentData', RecentDataSchema);