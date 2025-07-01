const express = require("express");
const { getAdminDestinations, updateAdminDestination, deleteAdminDestination} = require("../../controllers/destinations");

const router = express.Router();

router.get("/destinations", getAdminDestinations);
router.put("/destinations/:destinationId/update", updateAdminDestination);
router.delete("/destinations/:destinationId/delete", deleteAdminDestination);

module.exports = router;

// malah nyoba post /destinations di postman, dibilangnya unauthorized, jdi klo ga exist unauthorized gitu