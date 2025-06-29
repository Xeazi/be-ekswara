const query = require("../database");

async function getAllDestinations() {
    try {
        const rows = await query(
            `SELECT * FROM destinations`
        );

        const parsedRows = rows.map(destination => ({
            ...destination,
            facilities: JSON.parse(destination.facilities || '[]'),
            visiting_info: JSON.parse(destination.visiting_info || '{}'),
            languages: JSON.parse(destination.languages || '[]')
        }));

        return parsedRows;

    } catch (error) {
        throw(error);
    }

}

module.exports = {
    getAllDestinations
}