const query = require("../../database");

async function getAdminDestinations(username) {
    try {
        const rows = await query(
            `SELECT 
                id, name, location, park_hours, about, history, facilities, visiting_info, 
                duration_of_visit, group_size, ages, languages, map_url
            FROM 
                destinations
            WHERE
                created_by = (
                    SELECT id FROM admins WHERE username = ?
                )
            `, [username]
        );

        const parsedRows = rows.map(destination => ({
            ...destination,
            facilities: JSON.parse(destination.facilities || '[]'),
            visiting_info: JSON.parse(destination.visiting_info || '{}'),
            languages: JSON.parse(destination.languages || '[]'),
        }));

        return parsedRows;

    } catch (error) {
        throw error;
    }
}

async function updateAdminDestination(username, destinationId, {
    name = '', location = '', park_hours = '', about = '', history = '', 
    facilities = [], visiting_info = {}, duration_of_visit = '', group_size = '', 
    ages = '', languages = [], map_url = ''
}) {
    try {
        const rows = await query(
            `UPDATE destinations 
                name = ?, location = ?, park_hours = ?, about = ?, history = ?, facilities = ?, visiting_info = ?, 
                duration_of_visit = ?, group_size = ?, ages = ?, languages = ?, map_url = ?
            WHERE
                id = ?
            AND
                created_by = 
                    (
                        SELECT id FROM admins WHERE username = ?
                    )
            `, [name, location, park_hours, about, history, JSON.stringify(facilities), JSON.stringify(visiting_info), 
                duration_of_visit, group_size, ages, JSON.stringify(languages), map_url,
                destinationId, username]
        );

        return rows;

    } catch (error) {
        throw error;
    }
}

async function deleteAdminDestination(username, destinationId) {
    try {
        const rows = await query(
            `DELETE FROM 
                destinations
            WHERE
                id =  ?
            AND
                created_by =    
                    (
                        SELECT id FROM admins WHERE username = ?
                    )
            `, [destinationId, username]
        );

        return rows;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAdminDestinations,
    updateAdminDestination,
    deleteAdminDestination
}

// show admin's list of owned destinations.
// the username in the parameter should already be verified by passport 
// by checking payload.username w the requested username

// issue: the jwt probably should just hold the admin id instead of username