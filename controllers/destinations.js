const destinationsServices = require("../services/destinations");

async function getAllDestinations(req, res) {
    try {

        const data = await destinationsServices.getAllDestinations();

        return res.status(200).json(data);

    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");        
    }
}

async function getDestinationDetail(req, res) {
    try {
        const data = await destinationsServices.getDestinationDetail(req.params.destinationId);

        return res.status(200).json(data);

    } catch (error) {
        return res.status(400).json(error.message ?? "Something went wrong!");        
    }
}

module.exports = {
    getAllDestinations,
    getDestinationDetail
}