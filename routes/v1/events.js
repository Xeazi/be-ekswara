const express = require("express");
const {
  getAllEvents,
  getEventById,
  getEventsByDestination,
} = require("../../controllers/events");

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.get("/destinations/:destinationId/events", getEventsByDestination);

module.exports = router;
