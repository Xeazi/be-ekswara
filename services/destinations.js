const query = require("../database");

async function getAllDestinations() {
    try {
        const result = await query(`
          SELECT 
            d.id, 
            d.name, 
            d.location, 
            d.park_hours,
            (
              SELECT di.image_url
              FROM destinations_images di
              WHERE di.destination_id = d.id
              ORDER BY di.created_at ASC
              LIMIT 1
            ) AS image_url
          FROM destinations d
        `);

        return result;
  
    } catch (error) { 
        throw error;
    }
}

async function getDestinationDetail(destinationId) {
    try {
        const rows = await query(
            `SELECT 
                d.id,   
                d.name, 
                d.about, 
                d.history, 
                d.facilities,  
                d.visiting_info,
                d.duration_of_visit,
                d.group_size,
                d.ages,
                d.languages,
                d.map_url,
                (
                    SELECT GROUP_CONCAT(di.image_url ORDER BY di.created_at ASC SEPARATOR ',')
                    FROM (
                        SELECT * FROM destinations_images
                        WHERE destination_id = ?
                        ORDER BY created_at ASC
                        LIMIT 4
                    ) AS di
                ) AS images
            FROM destinations d
            WHERE d.id = ?
            `, [destinationId, destinationId]
        );

        const parsedRows = rows.map(destination => ({
            ...destination,
            facilities: JSON.parse(destination.facilities || '[]'),
            visiting_info: JSON.parse(destination.visiting_info || '{}'),
            languages: JSON.parse(destination.languages || '[]'),
            images: destination.images ? destination.images.split(',') : []
        }));

        return parsedRows[0];

    } catch (error) {
        throw(error);
    }


}

module.exports = {
    getAllDestinations,
    getDestinationDetail
}