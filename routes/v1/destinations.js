const express = require("express");
const { getAllDestinations } = require("../../controllers/destinations");

const router = express.Router();

router.get("/destinations", getAllDestinations);

module.exports = router;