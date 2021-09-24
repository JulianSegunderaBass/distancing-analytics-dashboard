// Helping functions
module.exports.sliceDateString = (date) => {
    return date.toISOString().substring(0, 10);
}