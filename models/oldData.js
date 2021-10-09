// Model for older data records
const mongoose = require('mongoose');

const OldDataSchema = new mongoose.Schema({
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
    },
    recordLocation: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('OldData', OldDataSchema);