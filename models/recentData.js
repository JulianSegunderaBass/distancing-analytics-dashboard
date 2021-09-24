// Model for current day's data
const mongoose = require('mongoose');

const RecentDataSchema = new mongoose.Schema({
    recordDate: {
        type: Date,
        required: true
    },
    violationCount: {
        type: Number,
        required: true
    },
    headcount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('RecentData', RecentDataSchema);