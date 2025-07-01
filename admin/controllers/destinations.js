const destinationsServices = require("../services/destinations");

// get the username from the token included in the get request

async function getAdminDestinations(req, res) {

    const username = req.user.username; // bisa gak ya!?!?

    console.log(username);

    try {
        const data = await destinationsServices.getAdminDestinations(username);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

async function updateAdminDestination(req, res) {

    const username = req.user.username;

    const destinationId = req.body.destinationId;

    const {
        name, location, park_hours, about, history, facilities, visiting_info,
        duration_of_visit, group_size, ages, languages, map_url
    } = req.body;

    try {
        const data = await destinationsServices.updateAdminDestination(username, destinationId, {
            name, location, park_hours, about, history, facilities, visiting_info,
            duration_of_visit, group_size, ages, languages, map_url
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

async function deleteAdminDestination(req, res) {

    const username = req.user.username;

    const destinationId = req.params.destinationId;

    try {
        const data = await destinationsServices.deleteAdminDestination(username, destinationId);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");
    }
}

module.exports = {
    getAdminDestinations,
    updateAdminDestination,
    deleteAdminDestination
}