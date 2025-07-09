const express = require("express");
const { getAllDestinations, getDestinationDetail } = require("../../controllers/destinations");

const router = express.Router();

router.get("/destinations", getAllDestinations);
router.get("/destinations/:destinationId", getDestinationDetail);

module.exports = router;