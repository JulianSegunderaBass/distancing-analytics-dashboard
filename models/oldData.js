// Model for older data records
const mongoose = require('mongoose');

const OldDataSchema = new mongoose.Schema({
    recordDate: Date,
    violationCount: Number,
    headcount: Number,
});

module.exports = mongoose.model('OldData', OldDataSchema);