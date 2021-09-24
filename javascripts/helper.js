// Helping functions
module.exports.sliceDateString = (date) => {
    return date.toISOString().substring(0, 10);
}

module.exports.aggregateViolations = (recordArray) => {
    total = 0;
    for (let record of recordArray) {
        total += record.violationCount;
    }
    return total;
}

module.exports.aggregateHeadcount = (recordArray) => {
    total = 0;
    for (let record of recordArray) {
        total += record.headcount;
    }
    return total;
}