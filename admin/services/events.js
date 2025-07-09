const query = require("../../database");

const fs = require("fs");
const path = require("path");

async function getAdminDestinationEvents(username, destinationId) {
    try {
        const result = await query(
            `SELECT 
                e.id,
                e.status,
                e.name,
                e.description,
                e.date,
                e.time,
                e.price,
                e.category,
                ei.image_url
            FROM 
                events e
            LEFT JOIN
                events_image ei ON ei.event_id = e.id
            WHERE
                destination_id = ?
            AND
                e.created_by = (
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
        status = 'held', 
        name = '', 
        description = '', 
        date = '', 
        time = '', 
        price = '', 
        category = '', 
        image_url = ''
    }) {
    try {
        const result = await query(
            `INSERT INTO events 
                (destination_id, status, name, description, date, time, price, category, created_by) 
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, (SELECT id FROM admins WHERE username = ?))
            `, [destinationId, status, name, description, date, time, price, category, 
                username]
        );

        const eventId = result.insertId;

        if (image_url) {
            await query(`INSERT INTO events_image (event_id, name, image_url) VALUES (?, ?, ?)`,
                [eventId, name, image_url])
        }

        return {eventId};

    } catch (error) {
        throw error;
    }

}

async function updateAdminEvent(username, eventId, 
    {
        status = 'held', 
        name = '', 
        description = '', 
        date = '', 
        time = '', 
        price = '', 
        category = '',
        image_url = null
}) {
    try {
        const result = await query(
            `UPDATE events SET
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

        if (!image_url) return result; // klo gada image berakhir disini

        // maafkan aku lupa created_by di events_image
        const queryOldImage = await query(
            `SELECT ei.image_url
            FROM 
                events_image ei
            JOIN 
                events e ON ei.event_id = e.id
            WHERE 
                ei.event_id = ?
            AND 
                e.created_by = 
                (
                    SELECT id FROM admins WHERE username = ?
                )
            `, [eventId, username]
        );

        const oldImage = queryOldImage[0]?.image_url; // [0] karena query bang bill gitu :(

        const filePath = path.join(__dirname, '../../', `${oldImage}`); // this could be wrong

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file (${oldImage}):`, err);
                    return;
                }
                console.log(`(${oldImage}) was successfully deleted.`);
            });
        } else {
            console.warn(`File (${oldImage}) does not exist at path: ${filePath}`);
        }

        const imageUpdate = await query(
            `UPDATE events_image ei 
            JOIN 
                events e ON ei.event_id = e.id
            SET
                ei.image_url = ?
            WHERE
                ei.event_id = ?
            AND 
                e.created_by =
                (
                    SELECT id from admins WHERE username = ?
                ) 
            
            `, [image_url, eventId, username]
        );

        return imageUpdate;

    } catch (error) {
        throw error;
    }
}

async function deleteAdminEvent(username, eventId) {
    try {
        // // maaf banget ini lupa buat created_by di events_image jdi terpaksa join iya jelek tau
        // gaperlu ini orang udah cascade lucu ya aku
        // await query(
        //     `DELETE ei FROM 
        //         events_image ei
        //     JOIN
        //         events e ON ei.event_id = e.id
        //     WHERE
        //         ei.event_id = ?
        //     AND
        //         e.created_by = 
        //             (
        //                 SELECT id FROM admins WHERE username = ?
        //             )
        //         `, [eventId, username]
        // );

        const queryOldImage = await query(
            `SELECT ei.image_url
            FROM 
                events_image ei
            JOIN 
                events e ON ei.event_id = e.id
            WHERE 
                ei.event_id = ?
            AND 
                e.created_by = 
                (
                    SELECT id FROM admins WHERE username = ?
                )
            `, [eventId, username]
        );

        const oldImage = queryOldImage[0]?.image_url; // iya ini copy diatas

        const filePath = path.join(__dirname, '../../', `${oldImage}`); 

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file (${oldImage}):`, err);
                    return;
                }
                console.log(`(${oldImage}) was successfully deleted.`);
            });
        } else {
            console.warn(`File (${oldImage}) does not exist at path: ${filePath}`);
        }

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