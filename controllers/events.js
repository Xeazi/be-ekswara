const eventsServices = require("../services/events");

async function getAllEvents(req, res) {
  try {
    const data = await eventsServices.getAllEvents();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error.message ?? "Something went wrong!");
  }
}


module.exports = {
  getAllEvents
};
