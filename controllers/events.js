const eventsServices = require("../services/events");

async function getAllEvents(req, res) {
  try {
    const data = await eventsServices.getAllEvents();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message ?? "Something went wrong!");
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const data = await eventsServices.getEventById(id);

    if (!data) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message ?? "Something went wrong!");
  }
}

async function getEventsByDestination(req, res) {
  try {
    const { destinationId } = req.params;
    const data = await eventsServices.getEventsByDestination(destinationId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message ?? "Something went wrong!");
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  getEventsByDestination,
};
