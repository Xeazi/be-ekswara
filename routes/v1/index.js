const express = require("express");
const todosRouter = require("./todos")
const studentRouter = require("./students")

const router = express.Router();
const apiVersion = "/v1";

router.use(apiVersion, todosRouter);
router.use(apiVersion, studentRouter);

module.exports = router;
