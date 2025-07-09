const eventsServices = require("../services/events");

// get the username from the token included in the get request
 
async function getAdminDestinationEvents(req, res) {
    
    const username = req.user.username;

    const destinationId = req.params.destinationId;
    
    try {
        const data = await eventsServices.getAdminDestinationEvents(username, destinationId);

        return res.status(200).json(data);     
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

async function createAdminEvent(req, res) {
    const username = req.user.username;

    const destinationId = req.params.destinationId;

    const {
        status, 
        name, 
        description, 
        date, 
        time, 
        price, 
        category
    } = req.body;

    const image_url = `/images/${destinationId}/${req.file.filename}`;
    
    try {
        const data = await eventsServices.createAdminEvent(username, destinationId, {
            status, 
            name, 
            description, 
            date, 
            time, 
            price, 
            category,
            image_url
        });

        return res.status(200).json(data);     
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

async function updateAdminEvent(req, res) {
    const username = req.user.username;

    const destinationId = req.params.destinationId;
    
    const eventId = req.params.eventId;

    const {
        status, 
        name, 
        description, 
        date, 
        time, 
        price, 
        category
    } = req.body;

    let image_url = null;

    if (req.file) {
        image_url = `/images/${destinationId}/${req.file.filename}`;
    }
    
    try {
        const data = await eventsServices.updateAdminEvent(username, eventId, {
            status, 
            name, 
            description, 
            date, 
            time, 
            price, 
            category,
            image_url
        });

        return res.status(200).json(data);     
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

async function deleteAdminEvent(req, res) {
    const username = req.user.username;

    const eventId = req.params.eventId;
    
    try {
        const data = await eventsServices.deleteAdminEvent(username, eventId);

        return res.status(200).json({message: 'Event was deleted successfully.'});     
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

module.exports = {
    getAdminDestinationEvents,
    createAdminEvent,
    updateAdminEvent,
    deleteAdminEvent
}