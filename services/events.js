const query = require("../database");

async function getAllEvents() {
  try {
    // Get all events with their images
    const rows = await query(`
            SELECT 
                e.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', ei.id,
                        'name', ei.name,
                        'image_url', ei.image_url,
                        'created_at', ei.created_at
                    )
                ) as images
            FROM events e
            LEFT JOIN events_image ei ON e.id = ei.event_id
            GROUP BY e.id
            ORDER BY e.created_at DESC
        `);

    // Parse the images JSON for each event
    const parsedRows = rows.map((event) => ({
      ...event,
      images: event.images ? JSON.parse(`[${event.images}]`) : [],
    }));

    return parsedRows;
  } catch (error) {
    throw error;
  }
}

async function getEventById(id) {
  try {
    const rows = await query(
      `
            SELECT 
                e.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', ei.id,
                        'name', ei.name,
                        'image_url', ei.image_url,
                        'created_at', ei.created_at
                    )
                ) as images
            FROM events e
            LEFT JOIN events_image ei ON e.id = ei.event_id
            WHERE e.id = ?
            GROUP BY e.id
        `,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    // Parse the images JSON for the event
    const event = {
      ...rows[0],
      images: rows[0].images ? JSON.parse(`[${rows[0].images}]`) : [],
    };

    return event;
  } catch (error) {
    throw error;
  }
}

async function getEventsByDestination(destinationId) {
  try {
    const rows = await query(
      `
            SELECT 
                e.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', ei.id,
                        'name', ei.name,
                        'image_url', ei.image_url,
                        'created_at', ei.created_at
                    )
                ) as images
            FROM events e
            LEFT JOIN events_image ei ON e.id = ei.event_id
            WHERE e.destination_id = ?
            GROUP BY e.id
            ORDER BY e.created_at DESC
        `,
      [destinationId]
    );

    // Parse the images JSON for each event
    const parsedRows = rows.map((event) => ({
      ...event,
      images: event.images ? JSON.parse(`[${event.images}]`) : [],
    }));

    return parsedRows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  getEventsByDestination,
};
