const query = require("../database");

async function getAllDestinations() {
    try {
        const result = await query(
            `SELECT * FROM destinations`
        );
        return result;        
    } catch (error) {
        throw(error);
    }

}

module.exports = {
    getAllDestinations
}