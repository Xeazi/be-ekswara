const express = require("express");
const apiV1 = require("./v1")

const router = express.Router();
const api = "/admin/api";

router.use(api, apiV1);

module.exports = router;
