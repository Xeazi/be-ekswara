const query = require("../../database");

async function getAdminDestinationEvents(username, destinationId) {
    try {
        const result = await query(
            `SELECT 
                id, status, name, description, date, time, price, category, 
            FROM 
                events
            WHERE
                destination_id = ?
            AND
                created_by = (
                    SELECT id FROM admins WHERE username = ?
                )
            `, [destinationId, username]
        );

        return result;

    } catch (error) {
        throw error;
    }
}

async function createAdminEvent(username, destinationId, 
    {
        status = 'held', name = '', description = '', date = '', time = '', price = '', category = ''
    }) {
    try {
        const result = await query(
            `INSERT INTO events 
                (destination_id, status, name, description, date, time, price, category, created_by) 
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, (SELECT id FROM admin WHERE username = ?))
            `, [destinationId, status, name, description, date, time, price, category, 
                username]
        );

        return result;

    } catch (error) {
        throw error;
    }
}

async function updateAdminEvent(username, eventId, 
    {
        status = 'held', name = '', description = '', date = '', time = '', price = '', category = ''
}) {
    try {
        const result = await query(
            `UPDATE destinations 
                status = ?, name = ?, description = ?, date = ?, time = ?, price = ?, category = ? 
            WHERE
                id = ?
            AND
                created_by = 
                    (
                        SELECT id FROM admins WHERE username = ?
                    )
            `, [status, name, description, date, time, price, category, 
                eventId, username]
        );

        return result;

    } catch (error) {
        throw error;
    }
}

async function deleteAdminEvent(username, eventId) {
    try {
        const result = await query(
            `DELETE FROM 
                events
            WHERE
                id =  ?
            AND
                created_by =    
                    (
                        SELECT id FROM admins WHERE username = ?
                    )
            `, [eventId, username]
        );

        return result;

    } catch (error) {
        throw error;
    }
}

// insert/update event image

module.exports = {
    getAdminDestinationEvents,
    createAdminEvent,
    updateAdminEvent,
    deleteAdminEvent
}

// jwt sebaiknya megang admin id daripada username