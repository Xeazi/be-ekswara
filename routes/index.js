const express = require("express");
const v1Router = require("./v1");

const router = express.Router();

// Semua routes dari v1 akan memiliki prefix /api/v1
router.use("/api/v1", v1Router);

module.exports = router;
