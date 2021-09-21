// Model for older data records
const mongoose = require('mongoose');

const OldDataSchema = new mongoose.Schema({
    recordDate: {
        month: Number,
        day: Number,
        year: Number
    },
    violationCount: Number,
    headcount: Number,
});

module.exports = mongoose.model('OldData', OldDataSchema);