const path = require("path");

const customerDir = path.join(__dirname, '../file/customers');

const destinationDir = (destinationId) => path.join(__dirname, `../file/destinations/${destinationId}`);

module.exports = {
    destinationDir,
};