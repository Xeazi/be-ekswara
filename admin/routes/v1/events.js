const express = require("express");
const { getAdminDestinationEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent } = require("../../controllers/events");

const router = express.Router();

router.get("/events", getAdminDestinationEvents);
router.post("/events/create", createAdminEvent);
router.put("/events/:eventId/update", updateAdminEvent);
router.delete("/events/:eventId/delete", deleteAdminEvent);

module.exports = router;

// params :destinationId di index.js routernya.