const express = require("express");

const {upload} = require("../../middleware/eventMulter");

const { getAdminDestinationEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent } = require("../../controllers/events");

const router = express.Router();

router.get("/destinations/:destinationId/events", getAdminDestinationEvents);
router.post("/destinations/:destinationId/events/create", upload.single('image'), createAdminEvent);
router.put("/destinations/:destinationId/events/:eventId/update", upload.single('image'), updateAdminEvent);
router.delete("/destinations/:destinationId/events/:eventId/delete", deleteAdminEvent);

module.exports = router;
