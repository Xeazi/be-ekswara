const express = require("express");

async function test(req, res) {
    console.log("TEST: " + req.user.username);
    return res.status(200).json({message: "yeah"});
}

const router = express.Router();

router.get("/test", test);

module.exports = router;